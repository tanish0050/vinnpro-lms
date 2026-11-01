"""
VinnPro AI Education OS - Common Utility Functions
Serialization helpers, pagination, response builders, etc.
"""
from datetime import datetime, timezone
from bson import ObjectId


# ── BSON / JSON serialization ──────────────────────────────────────────────────

def serialize_doc(doc: dict) -> dict:
    """
    Convert a MongoDB document to a JSON-serialisable dict.
    Converts ObjectId → str, datetime → ISO string.
    """
    if doc is None:
        return {}
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [serialize_doc(v) if isinstance(v, dict) else
                           (str(v) if isinstance(v, ObjectId) else v)
                           for v in value]
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        else:
            result[key] = value
    return result


def serialize_list(docs) -> list:
    """Serialize a cursor / list of MongoDB documents."""
    return [serialize_doc(doc) for doc in docs]


# ── Response builders ──────────────────────────────────────────────────────────

def success_response(data=None, message: str = "Success", status: int = 200):
    """Build a standard success JSON response."""
    from flask import jsonify
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status


def error_response(message: str = "An error occurred", status: int = 400):
    """Build a standard error JSON response."""
    from flask import jsonify
    return jsonify({"success": False, "error": message}), status


# ── Pagination ─────────────────────────────────────────────────────────────────

def paginate(query_cursor, page: int = 1, per_page: int = 10) -> dict:
    """
    Apply skip/limit pagination to a pymongo cursor.
    Returns a dict with items, total, page, per_page, pages.
    """
    total = query_cursor.collection.count_documents(query_cursor._spec)
    items = list(query_cursor.skip((page - 1) * per_page).limit(per_page))
    return {
        "items": serialize_list(items),
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": max(1, -(-total // per_page)),  # ceiling division
    }


# ── Date helpers ───────────────────────────────────────────────────────────────

def utcnow() -> datetime:
    """Return timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)


def parse_date(value: str | None) -> datetime | None:
    """Parse an ISO 8601 date string; return None on failure."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except (ValueError, TypeError):
        return None


# ── Validation helpers ─────────────────────────────────────────────────────────

def validate_required(data: dict, fields: list[str]) -> str | None:
    """
    Check that all required fields are present and non-empty.
    Returns the first missing field name, or None if all present.
    """
    for field in fields:
        if not data.get(field):
            return field
    return None


def is_valid_object_id(value: str) -> bool:
    """Return True if value is a valid 24-char hex ObjectId string."""
    try:
        ObjectId(value)
        return True
    except Exception:
        return False


# ── Role constants ─────────────────────────────────────────────────────────────

ROLE_ADMIN = "ADMIN"
ROLE_TEACHER = "TEACHER"
ROLE_STUDENT = "STUDENT"
