"""
VinnPro AI Education OS - Discussions Route
Course forums, question threads, replies, and upvotes.
"""
from flask import Blueprint, request
from bson import ObjectId
from utils import db
from utils.helpers import serialize_doc, serialize_list, success_response, error_response, validate_required, utcnow, is_valid_object_id
from utils.auth_helper import require_auth

discussions_bp = Blueprint("discussions", __name__)

@discussions_bp.route("/course/<course_id>", methods=["GET"])
@require_auth
def get_course_discussions(course_id, current_user):
    threads = list(db.discussions().find({"courseId": course_id}))
    # Attach author name & avatar
    for t in threads:
        user = db.users().find_one({"_id": ObjectId(t["userId"])}) if is_valid_object_id(t.get("userId", "")) else None
        t["authorName"] = user.get("name", "Unknown") if user else "Unknown"
        t["authorAvatar"] = user.get("avatar") if user else None
    return success_response(serialize_list(threads))

@discussions_bp.route("/create", methods=["POST"])
@require_auth
def create_thread(current_user):
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["courseId", "title", "content"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    doc = {
        "courseId": data["courseId"],
        "userId": str(current_user["_id"]),
        "title": data["title"].strip(),
        "content": data["content"].strip(),
        "isPinned": False,
        "likes": 0,
        "replies": [],
        "createdAt": utcnow(),
        "updatedAt": utcnow(),
    }
    res = db.discussions().insert_one(doc)
    doc["_id"] = res.inserted_id
    doc["authorName"] = current_user.get("name")
    doc["authorAvatar"] = current_user.get("avatar")
    return success_response(serialize_doc(doc), "Thread created", 201)

@discussions_bp.route("/<thread_id>/reply", methods=["POST"])
@require_auth
def reply_thread(thread_id, current_user):
    data = request.get_json(silent=True) or {}
    if not data.get("content"):
        return error_response("Content is required", 400)

    reply = {
        "id": str(ObjectId()),
        "userId": str(current_user["_id"]),
        "userName": current_user.get("name"),
        "userAvatar": current_user.get("avatar"),
        "content": data["content"].strip(),
        "createdAt": utcnow(),
        "likes": 0
    }
    db.discussions().update_one(
        {"_id": ObjectId(thread_id)},
        {"$push": {"replies": reply}, "$set": {"updatedAt": utcnow()}}
    )
    return success_response(serialize_doc(reply), "Reply added", 201)

@discussions_bp.route("/<thread_id>/like", methods=["POST"])
@require_auth
def like_thread(thread_id, current_user):
    db.discussions().update_one(
        {"_id": ObjectId(thread_id)},
        {"$inc": {"likes": 1}}
    )
    return success_response(message="Liked")
