"""
VinnPro AI Education OS - Quiz Routes
Create quizzes, attempt them, and view results.
"""
from flask import Blueprint, request
from bson import ObjectId

from utils import db
from utils.helpers import (
    serialize_doc, serialize_list, error_response, success_response,
    validate_required, is_valid_object_id, utcnow,
)
from utils.auth_helper import require_auth, require_teacher

quiz_bp = Blueprint("quiz", __name__)


# ── GET /api/quiz/lesson/:lesson_id ──────────────────────────────────────────
@quiz_bp.route("/lesson/<lesson_id>", methods=["GET"])
@require_auth
def get_quiz_for_lesson(current_user, lesson_id):
    """Get quiz attached to a lesson."""
    if not is_valid_object_id(lesson_id):
        return error_response("Invalid lesson ID", 400)

    quiz = db.quizzes().find_one({"lessonId": ObjectId(lesson_id)})
    if not quiz:
        return error_response("No quiz found for this lesson", 404)

    quiz_data = serialize_doc(quiz)
    questions_cursor = db.questions().find({"quizId": quiz["_id"]})
    qs = []
    for q in questions_cursor:
        qd = serialize_doc(q)
        # Hide correct answer from students
        if current_user["role"] == "STUDENT":
            qd.pop("answer", None)
        qs.append(qd)
    quiz_data["questions"] = qs

    return success_response(quiz_data)


# ── GET /api/quiz/:quiz_id ────────────────────────────────────────────────────
@quiz_bp.route("/<quiz_id>", methods=["GET"])
@require_auth
def get_quiz(current_user, quiz_id):
    """Get a quiz by ID."""
    if not is_valid_object_id(quiz_id):
        return error_response("Invalid quiz ID", 400)

    quiz = db.quizzes().find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        return error_response("Quiz not found", 404)

    quiz_data = serialize_doc(quiz)
    qs = list(db.questions().find({"quizId": quiz["_id"]}))
    result_qs = []
    for q in qs:
        qd = serialize_doc(q)
        if current_user["role"] == "STUDENT":
            qd.pop("answer", None)
        result_qs.append(qd)
    quiz_data["questions"] = result_qs
    return success_response(quiz_data)


# ── POST /api/quiz ────────────────────────────────────────────────────────────
@quiz_bp.route("", methods=["POST"])
@require_teacher
def create_quiz(current_user):
    """Create a quiz with questions."""
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["lessonId", "title"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    if not is_valid_object_id(data["lessonId"]):
        return error_response("Invalid lessonId", 400)

    # Check lesson exists
    lesson = db.lessons().find_one({"_id": ObjectId(data["lessonId"])})
    if not lesson:
        return error_response("Lesson not found", 404)

    quiz_doc = {
        "lessonId":     ObjectId(data["lessonId"]),
        "title":        data["title"].strip(),
        "description":  data.get("description", ""),
        "timeLimit":    int(data.get("timeLimit", 10)),
        "passingScore": int(data.get("passingScore", 70)),
        "createdAt":    utcnow(),
    }
    result = db.quizzes().insert_one(quiz_doc)
    quiz_id = result.inserted_id

    # Insert questions
    questions_data = data.get("questions", [])
    inserted_questions = []
    for q in questions_data:
        q_doc = {
            "quizId":    quiz_id,
            "text":      q.get("text", "").strip(),
            "type":      q.get("type", "MCQ").upper(),
            "options":   q.get("options", []),
            "answer":    q.get("answer", ""),
            "points":    int(q.get("points", 10)),
            "createdAt": utcnow(),
        }
        db.questions().insert_one(q_doc)
        inserted_questions.append(serialize_doc(q_doc))

    quiz_doc["_id"]       = quiz_id
    quiz_doc["questions"] = inserted_questions
    return success_response(serialize_doc(quiz_doc), "Quiz created", 201)


# ── PUT /api/quiz/:quiz_id ────────────────────────────────────────────────────
@quiz_bp.route("/<quiz_id>", methods=["PUT"])
@require_teacher
def update_quiz(current_user, quiz_id):
    """Update quiz metadata."""
    if not is_valid_object_id(quiz_id):
        return error_response("Invalid quiz ID", 400)
    data = request.get_json(silent=True) or {}
    allowed = ["title", "description", "timeLimit", "passingScore"]
    update = {k: v for k, v in data.items() if k in allowed}
    db.quizzes().update_one({"_id": ObjectId(quiz_id)}, {"$set": update})
    updated = db.quizzes().find_one({"_id": ObjectId(quiz_id)})
    return success_response(serialize_doc(updated), "Quiz updated")


# ── POST /api/quiz/:quiz_id/questions ─────────────────────────────────────────
@quiz_bp.route("/<quiz_id>/questions", methods=["POST"])
@require_teacher
def add_question(current_user, quiz_id):
    """Add a question to an existing quiz."""
    if not is_valid_object_id(quiz_id):
        return error_response("Invalid quiz ID", 400)
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["text", "answer"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    q_doc = {
        "quizId":    ObjectId(quiz_id),
        "text":      data["text"].strip(),
        "type":      data.get("type", "MCQ").upper(),
        "options":   data.get("options", []),
        "answer":    data["answer"],
        "points":    int(data.get("points", 10)),
        "createdAt": utcnow(),
    }
    result = db.questions().insert_one(q_doc)
    q_doc["_id"] = result.inserted_id
    return success_response(serialize_doc(q_doc), "Question added", 201)


# ── POST /api/quiz/:quiz_id/attempt ──────────────────────────────────────────
@quiz_bp.route("/<quiz_id>/attempt", methods=["POST"])
@require_auth
def attempt_quiz(current_user, quiz_id):
    """Submit a quiz attempt and get the score."""
    if not is_valid_object_id(quiz_id):
        return error_response("Invalid quiz ID", 400)

    quiz = db.quizzes().find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        return error_response("Quiz not found", 404)

    data    = request.get_json(silent=True) or {}
    answers = data.get("answers", [])  # List of {questionId, selected}
    time_taken = data.get("timeTaken", 0)

    questions = list(db.questions().find({"quizId": ObjectId(quiz_id)}))

    # Auto-grade
    total_points   = sum(q.get("points", 10) for q in questions)
    earned_points  = 0
    graded_answers = []

    q_map = {str(q["_id"]): q for q in questions}

    for ans in answers:
        qid      = str(ans.get("questionId", ""))
        selected = str(ans.get("selected", "")).strip()
        q        = q_map.get(qid)
        if not q:
            continue
        correct  = str(q["answer"]).strip().lower() == selected.lower()
        if correct:
            earned_points += q.get("points", 10)
        graded_answers.append({
            "questionId": qid,
            "selected":   selected,
            "correct":    correct,
            "answer":     q["answer"],
        })

    score  = round((earned_points / total_points) * 100, 2) if total_points else 0
    passed = score >= quiz.get("passingScore", 70)

    attempt_doc = {
        "userId":      current_user["_id"],
        "quizId":      ObjectId(quiz_id),
        "score":       score,
        "passed":      passed,
        "answers":     graded_answers,
        "timeTaken":   time_taken,
        "attemptedAt": utcnow(),
    }
    result = db.quiz_attempts().insert_one(attempt_doc)
    attempt_doc["_id"] = result.inserted_id

    # Award XP for passing
    if passed:
        db.users().update_one({"_id": current_user["_id"]}, {"$inc": {"xp": 50}})

    return success_response({
        "attempt": serialize_doc(attempt_doc),
        "score": score,
        "passed": passed,
        "totalPoints": total_points,
        "earnedPoints": earned_points,
    }, "Quiz submitted")


# ── GET /api/quiz/:quiz_id/attempts ──────────────────────────────────────────
@quiz_bp.route("/<quiz_id>/attempts", methods=["GET"])
@require_auth
def get_attempts(current_user, quiz_id):
    """Get all attempts for a quiz by the current user."""
    if not is_valid_object_id(quiz_id):
        return error_response("Invalid quiz ID", 400)
    attempts = list(db.quiz_attempts().find({
        "userId":  current_user["_id"],
        "quizId":  ObjectId(quiz_id),
    }).sort("attemptedAt", -1))
    return success_response(serialize_list(attempts))


# ── GET /api/quiz/:quiz_id/results (teacher) ──────────────────────────────────
@quiz_bp.route("/<quiz_id>/results", methods=["GET"])
@require_teacher
def get_all_results(current_user, quiz_id):
    """Get all students' attempts for a quiz (teacher view)."""
    if not is_valid_object_id(quiz_id):
        return error_response("Invalid quiz ID", 400)
    attempts = list(db.quiz_attempts().find({"quizId": ObjectId(quiz_id)}).sort("score", -1))
    return success_response(serialize_list(attempts))
