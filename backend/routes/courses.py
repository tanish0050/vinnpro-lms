"""
VinnPro AI Education OS - Courses Routes
Full CRUD for courses, modules, and lessons.
"""
from flask import Blueprint, request
from bson import ObjectId

from utils import db
from utils.helpers import (
    serialize_doc, serialize_list, error_response, success_response,
    validate_required, is_valid_object_id, utcnow,
)
from utils.auth_helper import require_auth, require_teacher, require_admin

courses_bp = Blueprint("courses", __name__)


# ═══════════════════════════════ COURSES ═════════════════════════════════════

# ── GET /api/courses ──────────────────────────────────────────────────────────
@courses_bp.route("", methods=["GET"])
def list_courses():
    """Return published courses with optional filters."""
    category  = request.args.get("category")
    level     = request.args.get("level")
    is_free   = request.args.get("isFree")
    search    = request.args.get("search", "").strip()
    page      = int(request.args.get("page", 1))
    per_page  = int(request.args.get("per_page", 10))

    query = {"isPublished": True}
    if category:
        query["category"] = category
    if level:
        query["level"] = level.upper()
    if is_free is not None:
        query["isFree"] = is_free.lower() == "true"
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search.lower()]}},
        ]

    total    = db.courses().count_documents(query)
    raw      = list(db.courses().find(query).skip((page - 1) * per_page).limit(per_page).sort("createdAt", -1))
    items    = serialize_list(raw)

    return success_response({
        "courses": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": max(1, -(-total // per_page)),
    })


# ── GET /api/courses/:id ──────────────────────────────────────────────────────
@courses_bp.route("/<course_id>", methods=["GET"])
def get_course(course_id):
    """Return a single course with its modules and lessons."""
    if not is_valid_object_id(course_id):
        return error_response("Invalid course ID", 400)

    course = db.courses().find_one({"_id": ObjectId(course_id)})
    if not course:
        return error_response("Course not found", 404)

    course_data = serialize_doc(course)

    # Attach modules
    mods = list(db.modules().find({"courseId": ObjectId(course_id)}).sort("order", 1))
    for mod in mods:
        mod_data = serialize_doc(mod)
        lsns = list(db.lessons().find({"moduleId": mod["_id"]}).sort("order", 1))
        mod_data["lessons"] = serialize_list(lsns)
        course_data.setdefault("modules", []).append(mod_data)

    return success_response(course_data)


# ── POST /api/courses ─────────────────────────────────────────────────────────
@courses_bp.route("", methods=["POST"])
@require_teacher
def create_course(current_user):
    """Create a new course (teacher / admin only)."""
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["title", "description", "category", "level"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    doc = {
        "title":        data["title"].strip(),
        "description":  data["description"].strip(),
        "thumbnail":    data.get("thumbnail", ""),
        "category":     data["category"],
        "level":        data["level"].upper(),
        "price":        float(data.get("price", 0)),
        "isFree":       data.get("isFree", True),
        "tags":         data.get("tags", []),
        "outcomes":     data.get("outcomes", []),
        "creatorId":    current_user["_id"],
        "isPublished":  data.get("isPublished", False),
        "studentsCount": 0,
        "rating":       0.0,
        "ratingsCount": 0,
        "createdAt":    utcnow(),
        "updatedAt":    utcnow(),
    }
    result = db.courses().insert_one(doc)
    doc["_id"] = result.inserted_id
    return success_response(serialize_doc(doc), "Course created", 201)


# ── PUT /api/courses/:id ──────────────────────────────────────────────────────
@courses_bp.route("/<course_id>", methods=["PUT"])
@require_teacher
def update_course(current_user, course_id):
    """Update course details (owner or admin)."""
    if not is_valid_object_id(course_id):
        return error_response("Invalid course ID", 400)

    course = db.courses().find_one({"_id": ObjectId(course_id)})
    if not course:
        return error_response("Course not found", 404)
    if str(course["creatorId"]) != str(current_user["_id"]) and current_user["role"] != "ADMIN":
        return error_response("Not authorised to edit this course", 403)

    data = request.get_json(silent=True) or {}
    allowed = ["title", "description", "thumbnail", "category", "level",
               "price", "isFree", "tags", "outcomes", "isPublished"]
    update = {k: v for k, v in data.items() if k in allowed}
    if "level" in update:
        update["level"] = update["level"].upper()
    update["updatedAt"] = utcnow()

    db.courses().update_one({"_id": ObjectId(course_id)}, {"$set": update})
    updated = db.courses().find_one({"_id": ObjectId(course_id)})
    return success_response(serialize_doc(updated), "Course updated")


# ── DELETE /api/courses/:id ───────────────────────────────────────────────────
@courses_bp.route("/<course_id>", methods=["DELETE"])
@require_teacher
def delete_course(current_user, course_id):
    """Soft-delete a course (unpublish) — admin can hard-delete."""
    if not is_valid_object_id(course_id):
        return error_response("Invalid course ID", 400)

    course = db.courses().find_one({"_id": ObjectId(course_id)})
    if not course:
        return error_response("Course not found", 404)
    if str(course["creatorId"]) != str(current_user["_id"]) and current_user["role"] != "ADMIN":
        return error_response("Not authorised to delete this course", 403)

    db.courses().update_one({"_id": ObjectId(course_id)}, {"$set": {"isPublished": False, "updatedAt": utcnow()}})
    return success_response(message="Course removed")


# ═══════════════════════════════ MODULES ═════════════════════════════════════

# ── GET /api/courses/:id/modules ──────────────────────────────────────────────
@courses_bp.route("/<course_id>/modules", methods=["GET"])
def list_modules(course_id):
    if not is_valid_object_id(course_id):
        return error_response("Invalid course ID", 400)
    mods = list(db.modules().find({"courseId": ObjectId(course_id)}).sort("order", 1))
    return success_response(serialize_list(mods))


# ── POST /api/courses/:id/modules ─────────────────────────────────────────────
@courses_bp.route("/<course_id>/modules", methods=["POST"])
@require_teacher
def create_module(current_user, course_id):
    if not is_valid_object_id(course_id):
        return error_response("Invalid course ID", 400)

    course = db.courses().find_one({"_id": ObjectId(course_id)})
    if not course:
        return error_response("Course not found", 404)
    if str(course["creatorId"]) != str(current_user["_id"]) and current_user["role"] != "ADMIN":
        return error_response("Not authorised", 403)

    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["title"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    existing_count = db.modules().count_documents({"courseId": ObjectId(course_id)})
    doc = {
        "courseId":    ObjectId(course_id),
        "title":       data["title"].strip(),
        "description": data.get("description", ""),
        "order":       data.get("order", existing_count + 1),
        "createdAt":   utcnow(),
    }
    result = db.modules().insert_one(doc)
    doc["_id"] = result.inserted_id
    return success_response(serialize_doc(doc), "Module created", 201)


# ── PUT /api/courses/:id/modules/:module_id ───────────────────────────────────
@courses_bp.route("/<course_id>/modules/<module_id>", methods=["PUT"])
@require_teacher
def update_module(current_user, course_id, module_id):
    if not is_valid_object_id(module_id):
        return error_response("Invalid module ID", 400)
    data = request.get_json(silent=True) or {}
    allowed = ["title", "description", "order"]
    update = {k: v for k, v in data.items() if k in allowed}
    db.modules().update_one({"_id": ObjectId(module_id)}, {"$set": update})
    updated = db.modules().find_one({"_id": ObjectId(module_id)})
    return success_response(serialize_doc(updated), "Module updated")


# ── DELETE /api/courses/:id/modules/:module_id ────────────────────────────────
@courses_bp.route("/<course_id>/modules/<module_id>", methods=["DELETE"])
@require_teacher
def delete_module(current_user, course_id, module_id):
    if not is_valid_object_id(module_id):
        return error_response("Invalid module ID", 400)
    db.modules().delete_one({"_id": ObjectId(module_id)})
    db.lessons().delete_many({"moduleId": ObjectId(module_id)})
    return success_response(message="Module and its lessons deleted")


# ═══════════════════════════════ LESSONS ═════════════════════════════════════

# ── GET /api/courses/:id/modules/:module_id/lessons ───────────────────────────
@courses_bp.route("/<course_id>/modules/<module_id>/lessons", methods=["GET"])
def list_lessons(course_id, module_id):
    if not is_valid_object_id(module_id):
        return error_response("Invalid module ID", 400)
    lsns = list(db.lessons().find({"moduleId": ObjectId(module_id)}).sort("order", 1))
    return success_response(serialize_list(lsns))


# ── POST /api/courses/:id/modules/:module_id/lessons ──────────────────────────
@courses_bp.route("/<course_id>/modules/<module_id>/lessons", methods=["POST"])
@require_teacher
def create_lesson(current_user, course_id, module_id):
    if not is_valid_object_id(module_id):
        return error_response("Invalid module ID", 400)
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["title", "contentType"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    content_type = data["contentType"].upper()
    if content_type not in ("VIDEO", "PDF", "AUDIO", "HTML", "QUIZ", "ASSIGNMENT"):
        return error_response("Invalid contentType", 400)

    existing_count = db.lessons().count_documents({"moduleId": ObjectId(module_id)})
    doc = {
        "moduleId":    ObjectId(module_id),
        "courseId":    ObjectId(course_id),
        "title":       data["title"].strip(),
        "contentType": content_type,
        "content":     data.get("content", ""),
        "duration":    data.get("duration", 0),
        "order":       data.get("order", existing_count + 1),
        "isPublished": data.get("isPublished", True),
        "createdAt":   utcnow(),
    }
    result = db.lessons().insert_one(doc)
    doc["_id"] = result.inserted_id
    return success_response(serialize_doc(doc), "Lesson created", 201)


# ── GET /api/courses/lessons/:lesson_id ───────────────────────────────────────
@courses_bp.route("/lessons/<lesson_id>", methods=["GET"])
@require_auth
def get_lesson(current_user, lesson_id):
    if not is_valid_object_id(lesson_id):
        return error_response("Invalid lesson ID", 400)
    lesson = db.lessons().find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        return error_response("Lesson not found", 404)
    return success_response(serialize_doc(lesson))


# ── PUT /api/courses/lessons/:lesson_id ───────────────────────────────────────
@courses_bp.route("/lessons/<lesson_id>", methods=["PUT"])
@require_teacher
def update_lesson(current_user, lesson_id):
    if not is_valid_object_id(lesson_id):
        return error_response("Invalid lesson ID", 400)
    data = request.get_json(silent=True) or {}
    allowed = ["title", "contentType", "content", "duration", "order", "isPublished"]
    update = {k: v for k, v in data.items() if k in allowed}
    db.lessons().update_one({"_id": ObjectId(lesson_id)}, {"$set": update})
    updated = db.lessons().find_one({"_id": ObjectId(lesson_id)})
    return success_response(serialize_doc(updated), "Lesson updated")


# ── DELETE /api/courses/lessons/:lesson_id ────────────────────────────────────
@courses_bp.route("/lessons/<lesson_id>", methods=["DELETE"])
@require_teacher
def delete_lesson(current_user, lesson_id):
    if not is_valid_object_id(lesson_id):
        return error_response("Invalid lesson ID", 400)
    db.lessons().delete_one({"_id": ObjectId(lesson_id)})
    return success_response(message="Lesson deleted")


# ── POST /api/courses/:id/enroll ─────────────────────────────────────────────
@courses_bp.route("/<course_id>/enroll", methods=["POST"])
@require_auth
def enroll(current_user, course_id):
    """Enrol the current user in a course."""
    if not is_valid_object_id(course_id):
        return error_response("Invalid course ID", 400)

    course = db.courses().find_one({"_id": ObjectId(course_id), "isPublished": True})
    if not course:
        return error_response("Course not found", 404)

    existing = db.enrollments().find_one({
        "userId":   current_user["_id"],
        "courseId": ObjectId(course_id),
    })
    if existing:
        return error_response("Already enrolled in this course", 409)

    doc = {
        "userId":      current_user["_id"],
        "courseId":    ObjectId(course_id),
        "progress":    0,
        "isCompleted": False,
        "enrolledAt":  utcnow(),
    }
    db.enrollments().insert_one(doc)
    db.courses().update_one({"_id": ObjectId(course_id)}, {"$inc": {"studentsCount": 1}})

    return success_response(serialize_doc(doc), "Enrolled successfully", 201)


# ── POST /api/courses/lessons/:lesson_id/progress ────────────────────────────
@courses_bp.route("/lessons/<lesson_id>/progress", methods=["POST"])
@require_auth
def update_lesson_progress(current_user, lesson_id):
    """Mark a lesson as completed / update watch time."""
    if not is_valid_object_id(lesson_id):
        return error_response("Invalid lesson ID", 400)

    data        = request.get_json(silent=True) or {}
    is_completed = data.get("isCompleted", False)
    watch_time   = data.get("watchTime", 0)
    last_position = data.get("lastPosition", 0)

    lesson = db.lessons().find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        return error_response("Lesson not found", 404)

    db.lesson_progress().update_one(
        {"userId": current_user["_id"], "lessonId": ObjectId(lesson_id)},
        {"$set": {
            "isCompleted":  is_completed,
            "watchTime":    watch_time,
            "lastPosition": last_position,
            "updatedAt":    utcnow(),
        },
         "$setOnInsert": {"createdAt": utcnow()}},
        upsert=True,
    )

    # Recalculate course progress if lesson completed
    if is_completed and lesson.get("courseId"):
        course_id_obj = lesson["courseId"]
        total_lessons = db.lessons().count_documents({"courseId": course_id_obj})
        completed_lessons = db.lesson_progress().count_documents({
            "userId":      current_user["_id"],
            "isCompleted": True,
            "lessonId":    {"$in": [l["_id"] for l in db.lessons().find({"courseId": course_id_obj}, {"_id": 1})]},
        })
        progress = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
        is_course_complete = progress == 100

        db.enrollments().update_one(
            {"userId": current_user["_id"], "courseId": course_id_obj},
            {"$set": {"progress": progress, "isCompleted": is_course_complete}},
        )

    return success_response(message="Progress updated")
