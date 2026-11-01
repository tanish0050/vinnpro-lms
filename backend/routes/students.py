"""
VinnPro AI Education OS - Student Dashboard Routes
Student course enrollments, study session logs, progress tracking.
"""
from flask import Blueprint, request
from bson import ObjectId
from utils import db
from utils.helpers import serialize_doc, serialize_list, success_response, error_response, utcnow
from utils.auth_helper import require_auth

students_bp = Blueprint("students", __name__)

@students_bp.route("/dashboard", methods=["GET"])
@require_auth
def get_student_dashboard(current_user):
    user_id = str(current_user["_id"])
    
    # Enrollments with course details
    enrollments = list(db.enrollments().find({"userId": user_id}))
    courses_enrolled = []
    total_progress = 0
    completed_count = 0

    for enr in enrollments:
        c_id = enr.get("courseId")
        course = None
        try:
            course = db.courses().find_one({"_id": ObjectId(c_id)})
        except Exception:
            course = db.courses().find_one({"_id": c_id})
        
        if course:
            prog = enr.get("progress", 0)
            total_progress += prog
            if enr.get("isCompleted", False):
                completed_count += 1
            courses_enrolled.append({
                "enrollmentId": str(enr.get("_id")),
                "course": serialize_doc(course),
                "progress": prog,
                "isCompleted": enr.get("isCompleted", False),
                "enrolledAt": enr.get("enrolledAt")
            })

    avg_progress = (total_progress / len(enrollments)) if enrollments else 0
    quiz_attempts = list(db.quiz_attempts().find({"userId": user_id}))
    avg_score = (sum(q.get("score", 0) for q in quiz_attempts) / len(quiz_attempts)) if quiz_attempts else 85
    
    # Study streak
    streak = current_user.get("streak", 4)
    
    return success_response({
        "enrolledCourses": courses_enrolled,
        "enrolledCount": len(enrollments),
        "completedCount": completed_count,
        "averageProgress": round(avg_progress, 1),
        "averageQuizScore": round(avg_score, 1),
        "studyStreakDays": streak,
        "xp": current_user.get("xp", 320)
    })

@students_bp.route("/study-session", methods=["POST"])
@require_auth
def log_study_session(current_user):
    data = request.get_json(silent=True) or {}
    duration = data.get("duration", 15)  # minutes
    course_id = data.get("courseId")

    db.study_sessions().insert_one({
        "userId": str(current_user["_id"]),
        "duration": duration,
        "courseId": course_id,
        "date": utcnow().strftime("%Y-%m-%d"),
        "createdAt": utcnow()
    })
    return success_response(message="Session logged")
