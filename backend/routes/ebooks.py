"""
VinnPro AI Education OS - Ebooks & Library Route
Ebook intelligence, PDF curriculum repository, OCR chunking references.
"""
from flask import Blueprint, request
from bson import ObjectId
from utils import db
from utils.helpers import serialize_doc, serialize_list, success_response, error_response, validate_required, utcnow
from utils.auth_helper import require_auth, require_teacher

ebooks_bp = Blueprint("ebooks", __name__)

@ebooks_bp.route("", methods=["GET"])
@require_auth
def list_ebooks(current_user):
    category = request.args.get("category")
    query = {}
    if category:
        query["category"] = category
    books = list(db.ebooks().find(query))
    return success_response(serialize_list(books))

@ebooks_bp.route("/upload", methods=["POST"])
@require_teacher
def upload_ebook(current_user):
    data = request.get_json(silent=True) or {}
    missing = validate_required(data, ["title", "fileUrl"])
    if missing:
        return error_response(f"Field '{missing}' is required", 400)

    doc = {
        "title": data["title"].strip(),
        "author": data.get("author", current_user.get("name")),
        "description": data.get("description", "").strip(),
        "fileUrl": data["fileUrl"],
        "coverUrl": data.get("coverUrl", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"),
        "category": data.get("category", "General"),
        "tags": data.get("tags", []),
        "pages": int(data.get("pages", 150)),
        "uploadedBy": str(current_user["_id"]),
        "isPublic": True,
        "createdAt": utcnow()
    }
    res = db.ebooks().insert_one(doc)
    doc["_id"] = res.inserted_id
    return success_response(serialize_doc(doc), "Ebook uploaded successfully", 201)
