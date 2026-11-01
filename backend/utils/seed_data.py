"""
VinnPro AI Education OS - Seed Data
Seeds demo users, courses, modules, and lessons on first run.
Run directly: python utils/seed_data.py
"""
import sys
import os

# Allow running from project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import datetime, timezone, timedelta
from bson import ObjectId
from utils import db
from utils.auth_helper import hash_password

def _hash(password: str) -> str:
    return hash_password(password)


def _utcnow():
    return datetime.now(timezone.utc)


# ─────────────────────────────────────────────────────────────────────────────
# USERS
# ─────────────────────────────────────────────────────────────────────────────
DEMO_USERS = [
    {
        "name": "Super Admin",
        "email": "admin@vinnpro.com",
        "password": "Admin@123",
        "role": "ADMIN",
        "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=SuperAdmin",
        "bio": "Platform administrator for VinnPro AI Education OS.",
        "isActive": True,
    },
    {
        "name": "Dr. Sarah Thompson",
        "email": "teacher@vinnpro.com",
        "password": "Teacher@123",
        "role": "TEACHER",
        "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=SarahThompson",
        "bio": "Senior instructor specialising in Python, AI, and Data Science.",
        "isActive": True,
    },
    {
        "name": "Alex Johnson",
        "email": "student@vinnpro.com",
        "password": "Student@123",
        "role": "STUDENT",
        "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=AlexJohnson",
        "bio": "Passionate learner exploring technology and programming.",
        "isActive": True,
    },
]


def seed_users(database):
    """Insert demo users if they don't already exist. Returns a dict of email→_id."""
    inserted = {}
    for u in DEMO_USERS:
        existing = database["users"].find_one({"email": u["email"]})
        if existing:
            inserted[u["email"]] = existing["_id"]
            print(f"  [skip] user {u['email']} already exists")
            continue
        doc = {
            "name": u["name"],
            "email": u["email"],
            "password_hash": _hash(u["password"]),
            "role": u["role"],
            "avatar": u["avatar"],
            "bio": u["bio"],
            "isActive": u["isActive"],
            "createdAt": _utcnow(),
            "updatedAt": _utcnow(),
            "xp": 0,
            "badges": [],
            "streak": 0,
        }
        result = database["users"].insert_one(doc)
        inserted[u["email"]] = result.inserted_id
        print(f"  [ok]   user {u['email']} created")
    return inserted


# ─────────────────────────────────────────────────────────────────────────────
# COURSES, MODULES, LESSONS
# ─────────────────────────────────────────────────────────────────────────────
DEMO_COURSES = [
    {
        "title": "Python for Beginners: Zero to Hero",
        "description": "A comprehensive Python course covering basics to intermediate concepts with hands-on projects.",
        "thumbnail": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        "category": "Programming",
        "level": "BEGINNER",
        "price": 0,
        "isFree": True,
        "tags": ["python", "programming", "beginner"],
        "outcomes": [
            "Write clean Python code",
            "Understand OOP concepts",
            "Build real-world projects",
            "Work with files and APIs",
        ],
        "modules": [
            {
                "title": "Getting Started with Python",
                "description": "Install Python and write your first program.",
                "order": 1,
                "lessons": [
                    {"title": "Introduction & Setup", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 15, "order": 1},
                    {"title": "Variables and Data Types", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 20, "order": 2},
                    {"title": "Control Flow: if/elif/else", "contentType": "HTML", "content": "<h2>Control Flow</h2><p>Learn how to control execution with conditions.</p>", "duration": 18, "order": 3},
                ],
            },
            {
                "title": "Functions and Modules",
                "description": "Master functions, scope, and built-in modules.",
                "order": 2,
                "lessons": [
                    {"title": "Defining Functions", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 22, "order": 1},
                    {"title": "Lambda & Higher-Order Functions", "contentType": "PDF", "content": "https://example.com/lambda.pdf", "duration": 15, "order": 2},
                    {"title": "Python Standard Library", "contentType": "HTML", "content": "<h2>Standard Library</h2><p>Explore os, sys, datetime, and more.</p>", "duration": 25, "order": 3},
                ],
            },
        ],
    },
    {
        "title": "Machine Learning with scikit-learn",
        "description": "Learn supervised and unsupervised ML algorithms using Python and scikit-learn.",
        "thumbnail": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
        "category": "Data Science",
        "level": "INTERMEDIATE",
        "price": 4999,
        "isFree": False,
        "tags": ["machine learning", "python", "scikit-learn", "AI"],
        "outcomes": [
            "Understand core ML algorithms",
            "Pre-process real datasets",
            "Build and evaluate ML models",
            "Deploy models with Flask",
        ],
        "modules": [
            {
                "title": "Foundations of Machine Learning",
                "description": "Understand key ML concepts and terminology.",
                "order": 1,
                "lessons": [
                    {"title": "What is Machine Learning?", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 18, "order": 1},
                    {"title": "Data Pre-processing", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 28, "order": 2},
                ],
            },
            {
                "title": "Supervised Learning",
                "description": "Linear Regression, Decision Trees, SVMs, and more.",
                "order": 2,
                "lessons": [
                    {"title": "Linear Regression", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 30, "order": 1},
                    {"title": "Decision Trees & Random Forests", "contentType": "PDF", "content": "https://example.com/rf.pdf", "duration": 35, "order": 2},
                    {"title": "Model Evaluation Metrics", "contentType": "HTML", "content": "<h2>Evaluation</h2><p>Accuracy, Precision, Recall, F1-Score, ROC-AUC.</p>", "duration": 20, "order": 3},
                ],
            },
        ],
    },
    {
        "title": "Web Development with React & Flask",
        "description": "Build full-stack applications using React on the frontend and Flask on the backend.",
        "thumbnail": "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800",
        "category": "Web Development",
        "level": "INTERMEDIATE",
        "price": 2999,
        "isFree": False,
        "tags": ["react", "flask", "javascript", "python", "fullstack"],
        "outcomes": [
            "Build React SPAs",
            "Create REST APIs with Flask",
            "Connect frontend to backend",
            "Deploy full-stack apps",
        ],
        "modules": [
            {
                "title": "React Fundamentals",
                "description": "JSX, components, state, and props.",
                "order": 1,
                "lessons": [
                    {"title": "React Setup & JSX", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 20, "order": 1},
                    {"title": "State & Props", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 25, "order": 2},
                    {"title": "Hooks: useState & useEffect", "contentType": "HTML", "content": "<h2>Hooks</h2><p>React hooks revolutionised functional components.</p>", "duration": 30, "order": 3},
                ],
            },
            {
                "title": "Flask REST API",
                "description": "Design and build robust REST endpoints.",
                "order": 2,
                "lessons": [
                    {"title": "Flask Blueprints & Routes", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 22, "order": 1},
                    {"title": "JWT Authentication", "contentType": "PDF", "content": "https://example.com/jwt.pdf", "duration": 20, "order": 2},
                ],
            },
        ],
    },
    {
        "title": "Data Structures & Algorithms",
        "description": "Master DSA concepts essential for technical interviews and competitive programming.",
        "thumbnail": "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800",
        "category": "Computer Science",
        "level": "ADVANCED",
        "price": 1999,
        "isFree": False,
        "tags": ["dsa", "algorithms", "data structures", "interviews"],
        "outcomes": [
            "Understand Big-O complexity",
            "Implement trees, graphs, heaps",
            "Solve dynamic programming problems",
            "Ace technical interviews",
        ],
        "modules": [
            {
                "title": "Arrays and Strings",
                "description": "Core array manipulations and string algorithms.",
                "order": 1,
                "lessons": [
                    {"title": "Array Basics & Two Pointers", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 28, "order": 1},
                    {"title": "Sliding Window Technique", "contentType": "HTML", "content": "<h2>Sliding Window</h2><p>Efficient O(n) solutions for subarray problems.</p>", "duration": 25, "order": 2},
                ],
            },
            {
                "title": "Trees and Graphs",
                "description": "BFS, DFS, shortest paths, and more.",
                "order": 2,
                "lessons": [
                    {"title": "Binary Search Trees", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 35, "order": 1},
                    {"title": "Graph Traversal: BFS & DFS", "contentType": "PDF", "content": "https://example.com/graphs.pdf", "duration": 40, "order": 2},
                    {"title": "Dijkstra's Algorithm", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 32, "order": 3},
                ],
            },
        ],
    },
    {
        "title": "JavaScript Mastery: ES6 to Modern JS",
        "description": "Complete JavaScript course from fundamentals to advanced ES6+ features, DOM manipulation, and async programming.",
        "thumbnail": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
        "category": "Programming",
        "level": "BEGINNER",
        "price": 0,
        "isFree": True,
        "tags": ["javascript", "es6", "web", "frontend"],
        "outcomes": [
            "Master JavaScript fundamentals",
            "Use ES6+ features confidently",
            "Handle async code with Promises",
            "Manipulate the DOM",
        ],
        "modules": [
            {
                "title": "JavaScript Basics",
                "description": "Variables, types, functions, and control flow.",
                "order": 1,
                "lessons": [
                    {"title": "Variables: let, const, var", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 15, "order": 1},
                    {"title": "Functions & Arrow Functions", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 20, "order": 2},
                    {"title": "Arrays & Objects", "contentType": "HTML", "content": "<h2>Arrays & Objects</h2><p>Core data structures in JavaScript.</p>", "duration": 18, "order": 3},
                ],
            },
            {
                "title": "Async JavaScript",
                "description": "Promises, async/await, and Fetch API.",
                "order": 2,
                "lessons": [
                    {"title": "Callbacks & Promises", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 25, "order": 1},
                    {"title": "async/await & Error Handling", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 22, "order": 2},
                ],
            },
        ],
    },
    {
        "title": "Java OOP: Object-Oriented Programming",
        "description": "Learn Java from scratch with a strong focus on object-oriented design principles, collections, and exception handling.",
        "thumbnail": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        "category": "Programming",
        "level": "BEGINNER",
        "price": 1499,
        "isFree": False,
        "tags": ["java", "oop", "programming", "beginners"],
        "outcomes": [
            "Understand Java syntax and OOP",
            "Work with classes and interfaces",
            "Handle exceptions properly",
            "Use Java Collections framework",
        ],
        "modules": [
            {
                "title": "Java Fundamentals",
                "description": "Syntax, types, loops, and control flow.",
                "order": 1,
                "lessons": [
                    {"title": "Java Setup & Hello World", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 12, "order": 1},
                    {"title": "Classes & Objects", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 28, "order": 2},
                    {"title": "Inheritance & Polymorphism", "contentType": "HTML", "content": "<h2>OOP Pillars</h2><p>Inheritance, polymorphism, encapsulation, abstraction.</p>", "duration": 32, "order": 3},
                ],
            },
            {
                "title": "Collections & Generics",
                "description": "ArrayList, HashMap, and generic types.",
                "order": 2,
                "lessons": [
                    {"title": "ArrayList & LinkedList", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 25, "order": 1},
                    {"title": "HashMap & HashSet", "contentType": "PDF", "content": "https://example.com/hashmap.pdf", "duration": 20, "order": 2},
                ],
            },
        ],
    },
    {
        "title": "C++ Programming: From Basics to STL",
        "description": "Master C++ programming including pointers, memory management, templates, and the Standard Template Library.",
        "thumbnail": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800",
        "category": "Programming",
        "level": "INTERMEDIATE",
        "price": 1999,
        "isFree": False,
        "tags": ["c++", "cpp", "stl", "pointers", "systems"],
        "outcomes": [
            "Write efficient C++ programs",
            "Understand pointers and memory",
            "Use STL containers and algorithms",
            "Apply templates and generics",
        ],
        "modules": [
            {
                "title": "C++ Basics & Pointers",
                "description": "Syntax, arrays, pointers, and references.",
                "order": 1,
                "lessons": [
                    {"title": "C++ Setup & Syntax", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 18, "order": 1},
                    {"title": "Pointers & Memory Management", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 35, "order": 2},
                    {"title": "References vs Pointers", "contentType": "HTML", "content": "<h2>References</h2><p>Key differences between references and pointers in C++.</p>", "duration": 22, "order": 3},
                ],
            },
            {
                "title": "STL: Standard Template Library",
                "description": "vectors, maps, sets, and algorithms.",
                "order": 2,
                "lessons": [
                    {"title": "Vector, Stack & Queue", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 30, "order": 1},
                    {"title": "STL Algorithms: sort, find, count", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 25, "order": 2},
                ],
            },
        ],
    },
    {
        "title": "Database Design & SQL Mastery",
        "description": "Learn relational database design, SQL queries from basic to advanced, indexing, normalization, and NoSQL basics.",
        "thumbnail": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        "category": "Data Science",
        "level": "BEGINNER",
        "price": 0,
        "isFree": True,
        "tags": ["sql", "database", "mysql", "postgresql", "nosql"],
        "outcomes": [
            "Write complex SQL queries",
            "Design normalized databases",
            "Understand indexing & optimization",
            "Use JOINs and aggregations",
        ],
        "modules": [
            {
                "title": "SQL Fundamentals",
                "description": "SELECT, INSERT, UPDATE, DELETE and basic queries.",
                "order": 1,
                "lessons": [
                    {"title": "Introduction to Databases & SQL", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 20, "order": 1},
                    {"title": "SELECT, WHERE & ORDER BY", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 25, "order": 2},
                    {"title": "INSERT, UPDATE, DELETE", "contentType": "HTML", "content": "<h2>DML Commands</h2><p>Modifying data in a relational database.</p>", "duration": 18, "order": 3},
                ],
            },
            {
                "title": "Advanced SQL & Database Design",
                "description": "JOINs, subqueries, normalization, and indexing.",
                "order": 2,
                "lessons": [
                    {"title": "JOINs: INNER, LEFT, RIGHT, FULL", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 32, "order": 1},
                    {"title": "Aggregations: GROUP BY & HAVING", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 22, "order": 2},
                    {"title": "Indexing & Query Optimization", "contentType": "PDF", "content": "https://example.com/sql-index.pdf", "duration": 28, "order": 3},
                ],
            },
        ],
    },
    {
        "title": "Git, GitHub & DevOps Essentials",
        "description": "Master version control with Git, collaboration with GitHub, and DevOps fundamentals including CI/CD pipelines.",
        "thumbnail": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
        "category": "Programming",
        "level": "BEGINNER",
        "price": 0,
        "isFree": True,
        "tags": ["git", "github", "devops", "cicd", "version-control"],
        "outcomes": [
            "Use Git for version control",
            "Collaborate with GitHub",
            "Manage branches and merges",
            "Set up basic CI/CD pipelines",
        ],
        "modules": [
            {
                "title": "Git Basics",
                "description": "init, commit, push, pull, and branching.",
                "order": 1,
                "lessons": [
                    {"title": "What is Git & Version Control?", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 15, "order": 1},
                    {"title": "Commits, Branches & Merging", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 25, "order": 2},
                    {"title": "Resolving Merge Conflicts", "contentType": "HTML", "content": "<h2>Merge Conflicts</h2><p>How to identify and resolve conflicts in Git.</p>", "duration": 20, "order": 3},
                ],
            },
            {
                "title": "GitHub & CI/CD",
                "description": "Pull requests, GitHub Actions, and deployment.",
                "order": 2,
                "lessons": [
                    {"title": "Pull Requests & Code Review", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 22, "order": 1},
                    {"title": "GitHub Actions CI/CD Pipeline", "contentType": "VIDEO", "content": "https://www.youtube.com/embed/dQw4w9WgXcQ", "duration": 30, "order": 2},
                ],
            },
        ],
    },
]



def seed_courses(database, teacher_id):
    """Insert demo courses with nested modules and lessons."""
    for course_data in DEMO_COURSES:
        existing = database["courses"].find_one({"title": course_data["title"]})
        if existing:
            print(f"  [skip] course '{course_data['title']}' already exists")
            continue

        modules_data = course_data.pop("modules", [])
        course_doc = {
            **course_data,
            "creatorId": teacher_id,
            "isPublished": True,
            "studentsCount": 0,
            "rating": 4.5,
            "ratingsCount": 0,
            "createdAt": _utcnow(),
            "updatedAt": _utcnow(),
        }
        course_result = database["courses"].insert_one(course_doc)
        course_id = course_result.inserted_id

        for mod in modules_data:
            lessons_data = mod.pop("lessons", [])
            module_doc = {
                **mod,
                "courseId": course_id,
                "createdAt": _utcnow(),
            }
            mod_result = database["modules"].insert_one(module_doc)
            module_id = mod_result.inserted_id

            for lesson in lessons_data:
                lesson_doc = {
                    **lesson,
                    "moduleId": module_id,
                    "courseId": course_id,
                    "isPublished": True,
                    "createdAt": _utcnow(),
                }
                database["lessons"].insert_one(lesson_doc)

        print(f"  [ok]   course '{course_data['title']}' created")

        # Put modules back so the list remains intact for potential re-use
        course_data["modules"] = modules_data


def seed_demo_quiz(database, student_id):
    """Seed a sample quiz and an attempt for the student user."""
    # Find any lesson to attach to
    lesson = database["lessons"].find_one({})
    if not lesson:
        return

    existing_quiz = database["quizzes"].find_one({"title": "Python Basics Quiz"})
    if existing_quiz:
        print("  [skip] demo quiz already exists")
        return

    quiz_doc = {
        "lessonId": lesson["_id"],
        "title": "Python Basics Quiz",
        "description": "Test your Python fundamentals knowledge.",
        "timeLimit": 10,  # minutes
        "passingScore": 70,
        "createdAt": _utcnow(),
    }
    quiz_result = database["quizzes"].insert_one(quiz_doc)
    quiz_id = quiz_result.inserted_id

    question_docs = [
        {
            "quizId": quiz_id,
            "text": "What keyword is used to define a function in Python?",
            "type": "MCQ",
            "options": ["function", "def", "fun", "define"],
            "answer": "def",
            "points": 10,
        },
        {
            "quizId": quiz_id,
            "text": "Python is a statically-typed language.",
            "type": "TRUE_FALSE",
            "options": ["True", "False"],
            "answer": "False",
            "points": 10,
        },
        {
            "quizId": quiz_id,
            "text": "Which method is used to add an element to the end of a list?",
            "type": "MCQ",
            "options": ["add()", "push()", "append()", "insert()"],
            "answer": "append()",
            "points": 10,
        },
    ]
    for q in question_docs:
        q["createdAt"] = _utcnow()
    database["questions"].insert_many(question_docs)

    # Seed one quiz attempt for the student
    database["quiz_attempts"].insert_one({
        "userId": student_id,
        "quizId": quiz_id,
        "score": 80,
        "passed": True,
        "answers": [
            {"questionIndex": 0, "selected": "def", "correct": True},
            {"questionIndex": 1, "selected": "False", "correct": True},
            {"questionIndex": 2, "selected": "append()", "correct": True},
        ],
        "timeTaken": 4,  # minutes
        "attemptedAt": _utcnow(),
    })
    print("  [ok]   demo quiz created with student attempt")


def seed_notifications(database, user_ids: list):
    """Insert welcome notifications for all demo users."""
    for uid in user_ids:
        if database["notifications"].find_one({"userId": uid, "title": "Welcome to VinnPro!"}):
            continue
        database["notifications"].insert_one({
            "userId": uid,
            "title": "Welcome to VinnPro!",
            "message": "Start learning today. Explore our free courses and track your progress.",
            "type": "INFO",
            "isRead": False,
            "createdAt": _utcnow(),
        })
    print("  [ok]   welcome notifications seeded")


def seed_study_sessions(database, student_id):
    """Insert 7 days of study session data for analytics."""
    for i in range(7):
        day = _utcnow() - timedelta(days=i)
        database["study_sessions"].update_one(
            {"userId": student_id, "date": day.strftime("%Y-%m-%d")},
            {"$setOnInsert": {
                "userId": student_id,
                "date": day.strftime("%Y-%m-%d"),
                "duration": 30 + (i * 5),  # minutes
                "courseId": None,
                "createdAt": day,
            }},
            upsert=True,
        )
    print("  [ok]   study sessions seeded")


def seed_enrollment(database, student_id):
    """Enrol the demo student in the first (free) course."""
    course = database["courses"].find_one({"isFree": True})
    if not course:
        return
    database["enrollments"].update_one(
        {"userId": student_id, "courseId": course["_id"]},
        {"$setOnInsert": {
            "userId": student_id,
            "courseId": course["_id"],
            "progress": 35,
            "isCompleted": False,
            "enrolledAt": _utcnow(),
        }},
        upsert=True,
    )
    print("  [ok]   student enrolled in first free course")


def seed_live_class(database, teacher_id):
    """Seed a sample live class session."""
    if database["live_classes"].find_one({"title": "Intro to Python – Live Q&A"}):
        print("  [skip] live class already exists")
        return
    database["live_classes"].insert_one({
        "title": "Intro to Python – Live Q&A",
        "description": "Interactive live session covering Python basics and student Q&A.",
        "teacherId": teacher_id,
        "scheduledAt": _utcnow() + timedelta(days=2),
        "duration": 90,  # minutes
        "platform": "Zoom",
        "meetingUrl": "https://zoom.us/j/123456789",
        "maxStudents": 100,
        "enrolledStudents": [],
        "isRecorded": True,
        "recordingUrl": None,
        "status": "SCHEDULED",
        "createdAt": _utcnow(),
    })
    print("  [ok]   live class seeded")


def seed_ebook(database, teacher_id):
    """Seed a sample ebook."""
    if database["ebooks"].find_one({"title": "Python Crash Course – Free Edition"}):
        print("  [skip] ebook already exists")
        return
    database["ebooks"].insert_one({
        "title": "Python Crash Course – Free Edition",
        "author": "Dr. Sarah Thompson",
        "description": "A beginner-friendly ebook covering Python fundamentals with exercises.",
        "fileUrl": "https://example.com/python-crash-course.pdf",
        "coverUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
        "category": "Programming",
        "tags": ["python", "beginner", "ebook"],
        "pages": 280,
        "uploadedBy": teacher_id,
        "downloadCount": 0,
        "isPublic": True,
        "createdAt": _utcnow(),
    })
    print("  [ok]   ebook seeded")


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def run_seed():
    """Execute all seed functions in order."""
    print("\n[*] Starting VinnPro seed process...")
    database = db.get_db()

    user_ids = seed_users(database)
    teacher_id = user_ids.get("teacher@vinnpro.com")
    student_id = user_ids.get("student@vinnpro.com")
    admin_id   = user_ids.get("admin@vinnpro.com")

    seed_courses(database, teacher_id)
    seed_demo_quiz(database, student_id)
    seed_notifications(database, [admin_id, teacher_id, student_id])
    seed_study_sessions(database, student_id)
    seed_enrollment(database, student_id)
    seed_live_class(database, teacher_id)
    seed_ebook(database, teacher_id)

    print("[OK] Seed complete!\n")


if __name__ == "__main__":
    run_seed()
