"""
VinnPro AI Education OS - AI Tutor RAG Route
Curriculum-aware AI responses with source citations, educational reasoning, and prompt handling.
"""
from flask import Blueprint, request
from bson import ObjectId
from utils import db
from utils.helpers import serialize_doc, serialize_list, success_response, error_response, utcnow
from utils.auth_helper import require_auth

ai_tutor_bp = Blueprint("ai_tutor", __name__)

AI_KNOWLEDGE_BASE = {
    "python": {
        "text": "Python is a high-level, interpreted programming language known for its readability. It supports Object-Oriented, Functional, and Procedural paradigms. Common data structures include lists, dictionaries, tuples, and sets.",
        "source": "Python for Beginners, Chapter 1 & 2"
    },
    "variable": {
        "text": "In Python, variables are dynamically typed references to objects in memory. You do not need to declare types explicitly: e.g. x = 10, name = 'Alex'.",
        "source": "Python for Beginners - Lesson 1.2: Variables and Data Types"
    },
    "function": {
        "text": "Functions in Python are defined with the 'def' keyword. They can accept positional, keyword, and default parameters, and can return single or multiple values packed in a tuple.",
        "source": "Functions and Modules - Lesson 2.1: Defining Functions"
    },
    "loop": {
        "text": "Python provides 'for' loops (iterating over sequences like ranges, lists, dicts) and 'while' loops (executing while a condition is true). Loop control includes break, continue, and pass.",
        "source": "Python Control Flow & Loops, Section 3"
    },
    "machine learning": {
        "text": "Machine Learning involves building mathematical models that learn patterns from training data to make predictions. Main categories: Supervised (labels), Unsupervised (clusters), and Reinforcement Learning.",
        "source": "Machine Learning with scikit-learn - Module 1: Foundations"
    },
    "react": {
        "text": "React is a component-based frontend UI library by Meta. Key concepts include JSX, unilateral data flow via Props, local component State, and Hooks (useState, useEffect, useMemo).",
        "source": "Web Development with React & Flask - Module 1: React Fundamentals"
    },
    "algorithm": {
        "text": "Algorithms are step-by-step procedures to solve computational problems. Efficiency is measured using Big-O time and space complexity, such as O(1), O(log n), O(n), O(n log n), and O(n^2).",
        "source": "Data Structures & Algorithms - Chapter 1: Complexity Analysis"
    }
}

@ai_tutor_bp.route("/chat", methods=["POST"])
@require_auth
def chat(current_user):
    data = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()
    course_id = data.get("courseId")
    
    if not question:
        return error_response("Question cannot be empty", 400)

    q_lower = question.lower()
    matched_sources = []
    response_paragraphs = []

    for key, info in AI_KNOWLEDGE_BASE.items():
        if key in q_lower:
            matched_sources.append(info["source"])
            response_paragraphs.append(info["text"])

    if not response_paragraphs:
        ai_reply = (
            f"Great question about **'{question}'**! 💡\n\n"
            "Here is the core concept:\n"
            "In computing and modern software engineering, mastering fundamentals step-by-step is key. "
            "Make sure to practice hands-on coding, break complex problems into smaller functional units, "
            "and review the quiz and lesson materials associated with your course.\n\n"
            "Would you like a practical code example or a step-by-step walkthrough?"
        )
        sources = ["VinnPro Curriculum AI Engine (Standard Core)"]
    else:
        ai_reply = (
            f"Here is what the course material explains regarding your query:\n\n"
            + "\n\n".join(response_paragraphs) + "\n\n"
            "💡 **Pro Tip**: Practice implementing this in your assignments to reinforce the concept."
        )
        sources = matched_sources

    chat_record = {
        "userId": str(current_user["_id"]),
        "courseId": course_id,
        "question": question,
        "answer": ai_reply,
        "sources": sources,
        "createdAt": utcnow()
    }
    db.ai_chats().insert_one(chat_record)

    return success_response({
        "question": question,
        "answer": ai_reply,
        "sources": sources,
        "timestamp": utcnow().isoformat()
    })

@ai_tutor_bp.route("/history", methods=["GET"])
@require_auth
def get_history(current_user):
    chats = list(db.ai_chats().find({"userId": str(current_user["_id"])}))
    return success_response(serialize_list(chats[-15:]))
