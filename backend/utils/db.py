"""
VinnPro AI Education OS - Smart Database Connection Helper
Connects to MongoDB Atlas / Local MongoDB when available.
Automatically falls back to a persistent JSON-backed local document store
if MongoDB is not running locally, ensuring 100% zero-config execution!
"""
import os
import json
from datetime import datetime, timezone
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

_client = None
_db = None
_is_fallback = False


class SimpleCursor:
    def __init__(self, items, collection=None, spec=None):
        self._items = items
        self.collection = collection
        self._spec = spec or {}

    def __iter__(self):
        return iter(self._items)

    def sort(self, key_or_list, direction=1):
        if isinstance(key_or_list, list):
            for k, d in reversed(key_or_list):
                self._items.sort(key=lambda x: str(x.get(k, "")), reverse=(d == -1))
        else:
            self._items.sort(key=lambda x: str(x.get(key_or_list, "")), reverse=(direction == -1))
        return self

    def skip(self, n):
        return SimpleCursor(self._items[n:], self.collection, self._spec)

    def limit(self, n):
        return SimpleCursor(self._items[:n], self.collection, self._spec)

    def count(self):
        return len(self._items)


class LocalCollection:
    def __init__(self, name, db_ref):
        self.name = name
        self.db = db_ref

    def _matches(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == "$or":
                if not any(self._matches(doc, subq) for subq in v):
                    return False
                continue
            if k == "$and":
                if not all(self._matches(doc, subq) for subq in v):
                    return False
                continue
            doc_val = doc.get(k)
            if isinstance(v, dict):
                if "$in" in v and doc_val not in v["$in"]:
                    return False
                if "$nin" in v and doc_val in v["$nin"]:
                    return False
                if "$ne" in v and doc_val == v["$ne"]:
                    return False
                if "$gt" in v and not (doc_val is not None and doc_val > v["$gt"]):
                    return False
                if "$gte" in v and not (doc_val is not None and doc_val >= v["$gte"]):
                    return False
                if "$lt" in v and not (doc_val is not None and doc_val < v["$lt"]):
                    return False
                if "$lte" in v and not (doc_val is not None and doc_val <= v["$lte"]):
                    return False
                if "$regex" in v:
                    import re
                    pattern = v["$regex"]
                    if not re.search(pattern, str(doc_val or ""), re.IGNORECASE):
                        return False
            else:
                if str(doc_val) != str(v) and doc_val != v:
                    return False
        return True

    def find_one(self, query=None):
        items = self.db._data.get(self.name, [])
        for item in items:
            if self._matches(item, query):
                return item
        return None

    def find(self, query=None):
        items = self.db._data.get(self.name, [])
        matched = [item for item in items if self._matches(item, query)]
        return SimpleCursor(matched, collection=self, spec=query or {})

    def insert_one(self, doc):
        if "_id" not in doc:
            doc["_id"] = ObjectId()
        if self.name not in self.db._data:
            self.db._data[self.name] = []
        self.db._data[self.name].append(doc)
        self.db._persist()
        
        class InsertResult:
            def __init__(self, id_val):
                self.inserted_id = id_val
        return InsertResult(doc["_id"])

    def insert_many(self, docs):
        ids = []
        for d in docs:
            res = self.insert_one(d)
            ids.append(res.inserted_id)
        
        class ManyResult:
            def __init__(self, ids_val):
                self.inserted_ids = ids_val
        return ManyResult(ids)

    def update_one(self, query, update, upsert=False):
        matched = self.find_one(query)
        if not matched:
            if upsert:
                new_doc = {}
                if "$setOnInsert" in update:
                    new_doc.update(update["$setOnInsert"])
                if "$set" in update:
                    new_doc.update(update["$set"])
                for k, v in (query or {}).items():
                    if not k.startswith("$") and k not in new_doc:
                        new_doc[k] = v
                res = self.insert_one(new_doc)
                class UpResult:
                    def __init__(self, mid):
                        self.matched_count = 0
                        self.modified_count = 1
                        self.upserted_id = mid
                return UpResult(res.inserted_id)
            class ZeroResult:
                matched_count = 0
                modified_count = 0
                upserted_id = None
            return ZeroResult()

        if "$set" in update:
            matched.update(update["$set"])
        if "$inc" in update:
            for k, inc_val in update["$inc"].items():
                matched[k] = matched.get(k, 0) + inc_val
        if "$push" in update:
            for k, push_val in update["$push"].items():
                if k not in matched or not isinstance(matched[k], list):
                    matched[k] = []
                matched[k].append(push_val)

        self.db._persist()
        class ModResult:
            matched_count = 1
            modified_count = 1
            upserted_id = None
        return ModResult()

    def delete_one(self, query):
        items = self.db._data.get(self.name, [])
        for i, item in enumerate(items):
            if self._matches(item, query):
                items.pop(i)
                self.db._persist()
                class DelResult:
                    deleted_count = 1
                return DelResult()
        class ZeroDelResult:
            deleted_count = 0
        return ZeroDelResult()

    def count_documents(self, query=None):
        return len(list(self.find(query)))

    def create_index(self, keys, unique=False):
        pass


class LocalDatabase:
    def __init__(self, storage_path="vinnpro_local_db.json"):
        self.storage_path = os.path.join(os.path.dirname(__file__), "..", storage_path)
        self._data = {}
        self._load()

    def _load(self):
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                    for coll, items in raw.items():
                        self._data[coll] = []
                        for item in items:
                            if "_id" in item and isinstance(item["_id"], str):
                                try:
                                    item["_id"] = ObjectId(item["_id"])
                                except Exception:
                                    pass
                            self._data[coll].append(item)
            except Exception:
                self._data = {}

    def _persist(self):
        try:
            to_save = {}
            for coll, items in self._data.items():
                to_save[coll] = []
                for item in items:
                    c = {}
                    for k, v in item.items():
                        if isinstance(v, ObjectId):
                            c[k] = str(v)
                        elif isinstance(v, datetime):
                            c[k] = v.isoformat()
                        else:
                            c[k] = v
                    to_save[coll].append(c)
            with open(self.storage_path, "w", encoding="utf-8") as f:
                json.dump(to_save, f, default=str)
        except Exception:
            pass

    def __getitem__(self, name):
        return LocalCollection(name, self)


def get_client():
    """Return MongoClient if available, else None."""
    global _client
    if _client is not None:
        return _client
    try:
        from pymongo import MongoClient
        uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/vinnpro_lms")
        client = MongoClient(uri, serverSelectionTimeoutMS=1500)
        client.admin.command("ping")
        _client = client
        return _client
    except Exception:
        return None


def get_db():
    """Return MongoDB handle or intelligent LocalDatabase fallback."""
    global _db, _is_fallback
    if _db is not None:
        return _db

    client = get_client()
    if client is not None:
        try:
            db_name = os.getenv("DB_NAME", "vinnpro_lms")
            _db = client[db_name]
            _ensure_indexes(_db)
            print("[+] Connected to MongoDB instance successfully.")
            return _db
        except Exception as e:
            print(f"[-] MongoDB setup error: {e}. Switching to local document store.")

    _is_fallback = True
    print("[*] Using Fast Embedded Document Store (No external DB required for local run).")
    _db = LocalDatabase()
    return _db


# ── Collection accessors ───────────────────────────────────────────────────────
def users():
    return get_db()["users"]

def courses():
    return get_db()["courses"]

def modules():
    return get_db()["modules"]

def lessons():
    return get_db()["lessons"]

def quizzes():
    return get_db()["quizzes"]

def questions():
    return get_db()["questions"]

def quiz_attempts():
    return get_db()["quiz_attempts"]

def assignments():
    return get_db()["assignments"]

def submissions():
    return get_db()["submissions"]

def enrollments():
    return get_db()["enrollments"]

def lesson_progress():
    return get_db()["lesson_progress"]

def discussions():
    return get_db()["discussions"]

def notifications():
    return get_db()["notifications"]

def study_sessions():
    return get_db()["study_sessions"]

def certificates():
    return get_db()["certificates"]

def ai_chats():
    return get_db()["ai_chats"]

def live_classes():
    return get_db()["live_classes"]

def ebooks():
    return get_db()["ebooks"]


def _ensure_indexes(db):
    try:
        from pymongo import ASCENDING, DESCENDING
        db["users"].create_index([("email", ASCENDING)], unique=True)
        db["courses"].create_index([("creatorId", ASCENDING)])
        db["enrollments"].create_index([("userId", ASCENDING), ("courseId", ASCENDING)])
    except Exception:
        pass
