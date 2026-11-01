"""
VinnPro AI Education OS - Admin Routes
Full administrative capabilities: user management, global analytics, system settings.
"""
from flask import Blueprint, request
from bson import ObjectId
from utils import db
from utils.auth_helper import hash_password
from utils.helpers import serialize_doc, serialize_list, success_response, error_response, validate_required, utcnow, is_valid_object_id
from utils.auth_helper import require_admin

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/stats", methods=["GET"])
@require_admin
def get_stats(current_user):
    total_users = db.users().count_documents({})
    total_students = db.users().count_documents({"role": "STUDENT"})
    total_teachers = db.users().count_documents({"role": "TEACHER"})
    total_courses = db.courses().count_documents({})
    total_enrollments = db.enrollments().count_documents({})
    
    # Calculate mock revenue based on enrollments
    revenue = total_enrollments * 2499
    
    return success_response({
        "totalUsers": total_users,
        "totalStudents": total_students,
        "totalTeachers": total_teachers,
        "totalCourses": total_courses,
        "totalEnrollments": total_enrollments,
        "revenue": revenue,
        "activeToday": max(1, int(total_users * 0.45))
    })

@admin_bp.route("/users", methods=["GET"])
@require_admin
def list_users(current_user):
    role = request.args.get("role")
    query = {}
    if role:
        query["role"] = role.upper()
    users_list = list(db.users().find(query))
    for u in users_list:
        u.pop("password_hash", None)
    return success_response(serialize_list(users_list))

@admin_bp.route("/users/<user_id>", methods=["PUT"])
@require_admin
def update_user(user_id, current_user):
    data = request.get_json(silent=True) or {}
    allowed = ["name", "role", "isActive", "bio"]
    updates = {k: v for k, v in data.items() if k in allowed}
    updates["updatedAt"] = utcnow()
    
    db.users().update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    user = db.users().find_one({"_id": ObjectId(user_id)})
    if user:
        user.pop("password_hash", None)
    return success_response(serialize_doc(user), "User updated")

@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@require_admin
def delete_user(user_id, current_user):
    db.users().delete_one({"_id": ObjectId(user_id)})
    return success_response(message="User deleted")

@admin_bp.route("/courses", methods=["GET"])
@require_admin
def list_courses(current_user):
    courses = list(db.courses().find({}))
    return success_response(serialize_list(courses))
