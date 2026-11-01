"""
VinnPro AI Education OS - JWT Auth Helpers & Decorators
Provides seamless JWT generation, verification, and role decorators.
Compatible with standard library (hmac/hashlib) and flask_jwt_extended.
"""
import os
import time
import json
import base64
import hmac
import hashlib
from functools import wraps
from flask import request, jsonify
from bson import ObjectId
from utils import db

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "vinnpro_secret_jwt_key_default_2026")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt if installed, or salted SHA-256."""
    try:
        import bcrypt
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt(10)).decode()
    except Exception:
        salt = "vinnpro_salt_2026"
        return "sha256$" + hashlib.sha256((salt + password).encode()).hexdigest()

def check_password(password: str, hashed: str) -> bool:
    """Verify password."""
    try:
        import bcrypt
        if hashed.startswith("$2b$") or hashed.startswith("$2a$"):
            return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        pass
    salt = "vinnpro_salt_2026"
    expected = "sha256$" + hashlib.sha256((salt + password).encode()).hexdigest()
    return hmac.compare_digest(hashed, expected)

def _b64_encode(data_bytes: bytes) -> str:
    return base64.urlsafe_b64encode(data_bytes).decode().rstrip("=")

def _b64_decode(data_str: str) -> bytes:
    padding = 4 - (len(data_str) % 4)
    if padding < 4:
        data_str += "=" * padding
    return base64.urlsafe_b64decode(data_str.encode())

def create_access_token(identity: str, expires_in_minutes: int = 120) -> str:
    """Create a standard JWT access token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(identity),
        "iat": int(time.time()),
        "exp": int(time.time()) + (expires_in_minutes * 60)
    }
    h_b64 = _b64_encode(json.dumps(header).encode())
    p_b64 = _b64_encode(json.dumps(payload).encode())
    sig = hmac.new(SECRET_KEY.encode(), f"{h_b64}.{p_b64}".encode(), hashlib.sha256).digest()
    s_b64 = _b64_encode(sig)
    return f"{h_b64}.{p_b64}.{s_b64}"

def create_refresh_token(identity: str) -> str:
    return create_access_token(identity, expires_in_minutes=60 * 24 * 30)

def decode_token(token: str) -> dict | None:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        h_b64, p_b64, s_b64 = parts
        expected_sig = _b64_encode(hmac.new(SECRET_KEY.encode(), f"{h_b64}.{p_b64}".encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(s_b64, expected_sig):
            return None
        payload = json.loads(_b64_decode(p_b64).decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

def _get_current_user_from_request():
    auth_header = request.headers.get("Authorization", "")
    token = ""
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    elif "token" in request.args:
        token = request.args.get("token")
    if not token:
        return None

    payload = decode_token(token)
    if not payload or "sub" not in payload:
        return None

    user_id = payload["sub"]
    try:
        user = db.users().find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = db.users().find_one({"_id": user_id})
    return user

def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = _get_current_user_from_request()
        if not user:
            return jsonify({"success": False, "error": "Authentication required or token expired"}), 401
        if not user.get("isActive", True):
            return jsonify({"success": False, "error": "Account is disabled"}), 403
        kwargs["current_user"] = user
        return fn(*args, **kwargs)
    return wrapper

def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = _get_current_user_from_request()
        if not user:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        if user.get("role") != "ADMIN":
            return jsonify({"success": False, "error": "Admin access required"}), 403
        kwargs["current_user"] = user
        return fn(*args, **kwargs)
    return wrapper

def require_teacher(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = _get_current_user_from_request()
        if not user:
            return jsonify({"success": False, "error": "Authentication required"}), 401
        if user.get("role") not in ("TEACHER", "ADMIN"):
            return jsonify({"success": False, "error": "Teacher or Admin access required"}), 403
        kwargs["current_user"] = user
        return fn(*args, **kwargs)
    return wrapper
