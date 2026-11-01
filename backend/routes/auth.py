"""
VinnPro AI Education OS - Auth Routes
Handles: register, login, logout, profile, and current user info.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from bson import ObjectId

from utils import db
from utils.helpers import serialize_doc, error_response, success_response, validate_required, utcnow
from utils.auth_helper import (
    require_auth,
    hash_password,
    check_password,
    create_access_token,
    create_refresh_token
)

auth_bp = Blueprint("auth", __name__)


def _safe_user(user: dict) -> dict:
    """Return user dict without sensitive fields."""
    u = serialize_doc(user)
    u.pop("password_hash", None)
    return u


# ── POST /api/auth/register ───────────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user account."""
    data = request.get_json(silent=True) or {}

    missing = validate_required(data, ["name", "email", "password"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    name     = data["name"].strip()
    email    = data["email"].strip().lower()
    password = data["password"]
    role     = "STUDENT"  # Public registration is for students only

    if role not in ("STUDENT",):
        return error_response("Public registration is only available for students", 400)

    if len(password) < 6:
        return error_response("Password must be at least 6 characters", 400)

    if db.users().find_one({"email": email}):
        return error_response("An account with this email already exists", 409)

    doc = {
        "name": name,
        "email": email,
        "password_hash": hash_password(password),
        "role": role,
        "avatar": data.get("avatar") or f"https://api.dicebear.com/7.x/initials/svg?seed={name.replace(' ', '')}",
        "bio": data.get("bio", ""),
        "isActive": True,
        "xp": 100,
        "badges": ["Welcome Pioneer"],
        "streak": 1,
        "createdAt": utcnow(),
        "updatedAt": utcnow(),
    }

    result = db.users().insert_one(doc)
    doc["_id"] = result.inserted_id

    access_token  = create_access_token(identity=str(doc["_id"]))
    refresh_token = create_refresh_token(identity=str(doc["_id"]))

    return success_response(
        {
            "user": _safe_user(doc),
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
        message="Registration successful",
        status=201,
    )


# ── POST /api/auth/login ──────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate with email and password, returning JWT access & refresh tokens."""
    data = request.get_json(silent=True) or {}

    missing = validate_required(data, ["email", "password"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    email    = data["email"].strip().lower()
    password = data["password"]

    user = db.users().find_one({"email": email})
    if not user:
        return error_response("Invalid email or password", 401)

    if not user.get("isActive", True):
        return error_response("This account has been deactivated. Contact admin.", 403)

    if not check_password(password, user.get("password_hash", "")):
        return error_response("Invalid email or password", 401)

    # Update last login
    db.users().update_one(
        {"_id": user["_id"]},
        {"$set": {"lastLogin": utcnow()}},
    )

    access_token  = create_access_token(identity=str(user["_id"]))
    refresh_token = create_refresh_token(identity=str(user["_id"]))

    return success_response(
        {
            "user": _safe_user(user),
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
        message="Login successful",
    )


# ── GET /api/auth/me ──────────────────────────────────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user_profile(current_user):
    """Return the profile of the currently authenticated user."""
    return success_response(_safe_user(current_user))


# ── PUT /api/auth/profile ─────────────────────────────────────────────────────
@auth_bp.route("/profile", methods=["PUT"])
@require_auth
def update_profile(current_user):
    """Update profile fields for the authenticated user."""
    data = request.get_json(silent=True) or {}
    allowed = ["name", "bio", "avatar", "phone"]
    updates = {k: v for k, v in data.items() if k in allowed}

    if not updates:
        return error_response("No valid fields provided for update", 400)

    updates["updatedAt"] = utcnow()
    db.users().update_one({"_id": current_user["_id"]}, {"$set": updates})

    updated = db.users().find_one({"_id": current_user["_id"]})
    return success_response(_safe_user(updated), message="Profile updated")
