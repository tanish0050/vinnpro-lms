"""
VinnPro AI Education OS - Live Classes & Webinars Route
BigBlueButton / Jitsi / Zoom integration, scheduling, attendance tracking.
"""
from flask import Blueprint, request
from bson import ObjectId
from utils import db
from utils.helpers import serialize_doc, serialize_list, success_response, error_response, validate_required, utcnow, parse_date
from utils.auth_helper import require_auth, require_teacher

live_classes_bp = Blueprint("live_classes", __name__)

@live_classes_bp.route("", methods=["GET"])
@require_auth
def list_classes(current_user):
    classes = list(db.live_classes().find({}))
    return success_response(serialize_list(classes))

@live_classes_bp.route("/schedule", methods=["POST"])
@require_teacher
def schedule_class(current_user):
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["title", "scheduledAt"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    platform = data.get("platform", "BigBlueButton")
    room_code = f"vinnpro-{int(utcnow().timestamp())}"
    meeting_url = f"https://meet.jit.si/{room_code}" if platform == "Jitsi" else f"https://demo.bigbluebutton.org/gl/{room_code}"

    doc = {
        "title": data["title"].strip(),
        "description": data.get("description", "").strip(),
        "teacherId": str(current_user["_id"]),
        "teacherName": current_user.get("name"),
        "scheduledAt": parse_date(data["scheduledAt"]) or utcnow(),
        "duration": int(data.get("duration", 60)),
        "platform": platform,
        "meetingUrl": data.get("meetingUrl") or meeting_url,
        "maxStudents": int(data.get("maxStudents", 60)),
        "status": "UPCOMING",
        "createdAt": utcnow()
    }
    res = db.live_classes().insert_one(doc)
    doc["_id"] = res.inserted_id
    return success_response(serialize_doc(doc), "Live class scheduled", 201)


# ── Admin: Create a meeting ───────────────────────────────────────────────────
@live_classes_bp.route("/admin/create", methods=["POST"])
@require_auth
def admin_create_meeting(current_user):
    if current_user.get("role") != "ADMIN":
        return error_response("Admin access required", 403)
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["title"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    platform = data.get("platform", "Jitsi")
    room_code = f"vinnpro-{int(utcnow().timestamp())}"
    meeting_url = data.get("meetingUrl") or f"https://meet.jit.si/{room_code}"

    doc = {
        "title": data["title"].strip(),
        "description": data.get("description", "").strip(),
        "teacherId": str(current_user["_id"]),
        "teacherName": current_user.get("name", "Admin"),
        "scheduledAt": utcnow(),
        "duration": int(data.get("duration", 60)),
        "platform": platform,
        "meetingUrl": meeting_url,
        "maxStudents": int(data.get("maxStudents", 100)),
        "status": data.get("status", "UPCOMING"),
        "createdAt": utcnow()
    }
    res = db.live_classes().insert_one(doc)
    doc["_id"] = res.inserted_id
    return success_response(serialize_doc(doc), "Meeting created", 201)


# ── Admin: Update meeting status (UPCOMING / LIVE / ENDED) ───────────────────
@live_classes_bp.route("/admin/<class_id>/status", methods=["PUT"])
@require_auth
def admin_update_status(class_id, current_user):
    if current_user.get("role") != "ADMIN":
        return error_response("Admin access required", 403)
    data = request.get_json(silent=True) or {}
    status = data.get("status", "LIVE")
    if status not in ("UPCOMING", "LIVE", "ENDED"):
        return error_response("status must be UPCOMING, LIVE, or ENDED", 400)
    try:
        db.live_classes().update_one({"_id": ObjectId(class_id)}, {"$set": {"status": status}})
    except Exception:
        return error_response("Invalid class ID", 400)
    return success_response({"status": status}, "Status updated")


# ── Admin: Delete meeting ─────────────────────────────────────────────────────
@live_classes_bp.route("/admin/<class_id>", methods=["DELETE"])
@require_auth
def admin_delete_meeting(class_id, current_user):
    if current_user.get("role") != "ADMIN":
        return error_response("Admin access required", 403)
    try:
        res = db.live_classes().delete_one({"_id": ObjectId(class_id)})
    except Exception:
        return error_response("Invalid class ID", 400)
    if res.deleted_count == 0:
        return error_response("Meeting not found", 404)
    return success_response({}, "Meeting deleted")


# ── Active / LIVE meetings for student banner ─────────────────────────────────
@live_classes_bp.route("/active", methods=["GET"])
@require_auth
def get_active_meetings(current_user):
    classes = list(db.live_classes().find({"status": "LIVE"}))
    return success_response(serialize_list(classes))


@live_classes_bp.route("/<class_id>/join", methods=["POST"])
@require_auth
def join_class(class_id, current_user):
    try:
        c = db.live_classes().find_one({"_id": ObjectId(class_id)})
    except Exception:
        return error_response("Invalid class ID", 400)
    if not c:
        return error_response("Class not found", 404)
    return success_response({
        "meetingUrl": c.get("meetingUrl"),
        "platform": c.get("platform"),
        "title": c.get("title")
    }, "Join credentials issued")
