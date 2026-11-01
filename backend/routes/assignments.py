"""
VinnPro AI Education OS - Assignments Routes
Create, submit, and grade assignments.
"""
from flask import Blueprint, request
from bson import ObjectId

from utils import db
from utils.helpers import (
    serialize_doc, serialize_list, error_response, success_response,
    validate_required, is_valid_object_id, utcnow, parse_date,
)
from utils.auth_helper import require_auth, require_teacher

assignments_bp = Blueprint("assignments", __name__)


# ── GET /api/assignments/lesson/:lesson_id ───────────────────────────────────
@assignments_bp.route("/lesson/<lesson_id>", methods=["GET"])
@require_auth
def get_assignment_for_lesson(current_user, lesson_id):
    """Get assignment details for a given lesson."""
    if not is_valid_object_id(lesson_id):
        return error_response("Invalid lesson ID", 400)

    assignment = db.assignments().find_one({"lessonId": ObjectId(lesson_id)})
    if not assignment:
        return error_response("No assignment found for this lesson", 404)

    assignment_data = serialize_doc(assignment)

    # Attach student's own submission if exists
    submission = db.submissions().find_one({
        "userId":       current_user["_id"],
        "assignmentId": assignment["_id"],
    })
    assignment_data["mySubmission"] = serialize_doc(submission) if submission else None

    return success_response(assignment_data)


# ── GET /api/assignments/:assignment_id ───────────────────────────────────────
@assignments_bp.route("/<assignment_id>", methods=["GET"])
@require_auth
def get_assignment(current_user, assignment_id):
    if not is_valid_object_id(assignment_id):
        return error_response("Invalid assignment ID", 400)
    assignment = db.assignments().find_one({"_id": ObjectId(assignment_id)})
    if not assignment:
        return error_response("Assignment not found", 404)
    return success_response(serialize_doc(assignment))


# ── POST /api/assignments ─────────────────────────────────────────────────────
@assignments_bp.route("", methods=["POST"])
@require_teacher
def create_assignment(current_user):
    """Create a new assignment."""
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["lessonId", "title", "description"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    if not is_valid_object_id(data["lessonId"]):
        return error_response("Invalid lessonId", 400)

    lesson = db.lessons().find_one({"_id": ObjectId(data["lessonId"])})
    if not lesson:
        return error_response("Lesson not found", 404)

    due_date = parse_date(data.get("dueDate"))

    doc = {
        "lessonId":    ObjectId(data["lessonId"]),
        "title":       data["title"].strip(),
        "description": data["description"].strip(),
        "dueDate":     due_date,
        "maxScore":    int(data.get("maxScore", 100)),
        "createdBy":   current_user["_id"],
        "createdAt":   utcnow(),
        "updatedAt":   utcnow(),
    }
    result = db.assignments().insert_one(doc)
    doc["_id"] = result.inserted_id
    return success_response(serialize_doc(doc), "Assignment created", 201)


# ── PUT /api/assignments/:assignment_id ───────────────────────────────────────
@assignments_bp.route("/<assignment_id>", methods=["PUT"])
@require_teacher
def update_assignment(current_user, assignment_id):
    if not is_valid_object_id(assignment_id):
        return error_response("Invalid assignment ID", 400)
    data = request.get_json(silent=True) or {}
    allowed = ["title", "description", "dueDate", "maxScore"]
    update = {k: v for k, v in data.items() if k in allowed}
    if "dueDate" in update:
        update["dueDate"] = parse_date(update["dueDate"])
    update["updatedAt"] = utcnow()
    db.assignments().update_one({"_id": ObjectId(assignment_id)}, {"$set": update})
    updated = db.assignments().find_one({"_id": ObjectId(assignment_id)})
    return success_response(serialize_doc(updated), "Assignment updated")


# ── POST /api/assignments/:assignment_id/submit ───────────────────────────────
@assignments_bp.route("/<assignment_id>/submit", methods=["POST"])
@require_auth
def submit_assignment(current_user, assignment_id):
    """Submit work for an assignment."""
    if not is_valid_object_id(assignment_id):
        return error_response("Invalid assignment ID", 400)

    assignment = db.assignments().find_one({"_id": ObjectId(assignment_id)})
    if not assignment:
        return error_response("Assignment not found", 404)

    # Check for existing submission
    existing = db.submissions().find_one({
        "userId":       current_user["_id"],
        "assignmentId": ObjectId(assignment_id),
    })
    if existing and existing.get("status") == "GRADED":
        return error_response("This assignment has already been graded", 409)

    data    = request.get_json(silent=True) or {}
    content = data.get("content", "").strip()
    if not content:
        return error_response("Submission content cannot be empty", 400)

    submission_doc = {
        "userId":       current_user["_id"],
        "assignmentId": ObjectId(assignment_id),
        "content":      content,
        "score":        None,
        "feedback":     None,
        "status":       "SUBMITTED",
        "submittedAt":  utcnow(),
        "updatedAt":    utcnow(),
    }

    if existing:
        db.submissions().update_one(
            {"_id": existing["_id"]},
            {"$set": {
                "content":     content,
                "status":      "SUBMITTED",
                "submittedAt": utcnow(),
                "updatedAt":   utcnow(),
            }},
        )
        submission_doc["_id"] = existing["_id"]
    else:
        result = db.submissions().insert_one(submission_doc)
        submission_doc["_id"] = result.inserted_id

    # Notify teacher
    course_lesson = db.lessons().find_one({"_id": assignment.get("lessonId")})
    if course_lesson:
        course = db.courses().find_one({"_id": course_lesson.get("courseId")})
        if course and course.get("creatorId"):
            db.notifications().insert_one({
                "userId":    course["creatorId"],
                "title":     "New Assignment Submission",
                "message":   f"{current_user['name']} submitted '{assignment['title']}'.",
                "type":      "ASSIGNMENT",
                "isRead":    False,
                "createdAt": utcnow(),
            })

    return success_response(serialize_doc(submission_doc), "Assignment submitted", 201)


# ── GET /api/assignments/:assignment_id/submissions ───────────────────────────
@assignments_bp.route("/<assignment_id>/submissions", methods=["GET"])
@require_teacher
def list_submissions(current_user, assignment_id):
    """List all submissions for an assignment (teacher view)."""
    if not is_valid_object_id(assignment_id):
        return error_response("Invalid assignment ID", 400)
    subs = list(db.submissions().find({"assignmentId": ObjectId(assignment_id)}).sort("submittedAt", -1))
    return success_response(serialize_list(subs))


# ── PUT /api/assignments/submissions/:submission_id/grade ─────────────────────
@assignments_bp.route("/submissions/<submission_id>/grade", methods=["PUT"])
@require_teacher
def grade_submission(current_user, submission_id):
    """Grade a submission and send feedback."""
    if not is_valid_object_id(submission_id):
        return error_response("Invalid submission ID", 400)

    data  = request.get_json(silent=True) or {}
    score = data.get("score")
    feedback = data.get("feedback", "").strip()

    if score is None:
        return error_response("score is required", 400)

    submission = db.submissions().find_one({"_id": ObjectId(submission_id)})
    if not submission:
        return error_response("Submission not found", 404)

    db.submissions().update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {
            "score":     float(score),
            "feedback":  feedback,
            "status":    "GRADED",
            "gradedBy":  current_user["_id"],
            "gradedAt":  utcnow(),
            "updatedAt": utcnow(),
        }},
    )

    # Notify student
    db.notifications().insert_one({
        "userId":    submission["userId"],
        "title":     "Assignment Graded",
        "message":   f"Your assignment has been graded. Score: {score}. {feedback}",
        "type":      "GRADE",
        "isRead":    False,
        "createdAt": utcnow(),
    })

    updated = db.submissions().find_one({"_id": ObjectId(submission_id)})
    return success_response(serialize_doc(updated), "Submission graded")


# ── GET /api/assignments/my-submissions ───────────────────────────────────────
@assignments_bp.route("/my-submissions", methods=["GET"])
@require_auth
def my_submissions(current_user):
    """Get all submissions by the current user."""
    subs = list(db.submissions().find({"userId": current_user["_id"]}).sort("submittedAt", -1))
    return success_response(serialize_list(subs))
