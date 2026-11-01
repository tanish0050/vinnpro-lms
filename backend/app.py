"""
VinnPro AI Education OS - Main Application Entry Point
Flask REST API + MongoDB + JWT Role Based Authentication
"""
import os
import sys
from flask import Flask, jsonify, send_from_directory, request

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import config_by_name
from utils import db, seed_data

# Route Blueprints
from routes.auth import auth_bp
from routes.courses import courses_bp
from routes.quiz import quiz_bp
from routes.assignments import assignments_bp
from routes.discussions import discussions_bp
from routes.admin import admin_bp
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.ai_tutor import ai_tutor_bp
from routes.live_classes import live_classes_bp
from routes.ebooks import ebooks_bp
from routes.misc_routes import notifications_bp, analytics_bp, certificates_bp, leaderboard_bp

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
    static_folder = frontend_dist if os.path.exists(frontend_dist) else None

    app = Flask(__name__, static_folder=static_folder, static_url_path="")
    app_config = config_by_name.get(config_name, config_by_name["default"])
    app.config.from_object(app_config)

    # Enable CORS
    try:
        from flask_cors import CORS
        CORS(
            app,
            resources={r"/api/*": {"origins": "*"}},
            supports_credentials=True,
            allow_headers=["Content-Type", "Authorization"],
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
        )
    except Exception:
        @app.after_request
        def add_cors_headers(response):
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            return response

        @app.route("/api/<path:path>", methods=["OPTIONS"])
        def handle_options(path):
            return "", 204

    # Optional flask_jwt_extended init
    try:
        from flask_jwt_extended import JWTManager
        jwt = JWTManager(app)
    except Exception:
        pass

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(courses_bp, url_prefix="/api/courses")
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
    app.register_blueprint(assignments_bp, url_prefix="/api/assignments")
    app.register_blueprint(discussions_bp, url_prefix="/api/discussions")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(teachers_bp, url_prefix="/api/teachers")
    app.register_blueprint(ai_tutor_bp, url_prefix="/api/ai")
    app.register_blueprint(live_classes_bp, url_prefix="/api/live-classes")
    app.register_blueprint(ebooks_bp, url_prefix="/api/ebooks")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(certificates_bp, url_prefix="/api/certificates")
    app.register_blueprint(leaderboard_bp, url_prefix="/api/leaderboard")

    # Health check
    @app.route("/", methods=["GET"])
    def root():
        if static_folder and os.path.exists(os.path.join(static_folder, "index.html")):
            return send_from_directory(static_folder, "index.html")
        return jsonify({
            "status": "online",
            "system": "VinnPro AI Education OS API",
            "version": "2.0.0",
            "docs": "/api",
            "features": [
                "LMS Modular Curriculum",
                "Ebook Intelligence & OCR Chunking",
                "Student Study & Engagement Tracking",
                "Live Classes & BigBlueButton/Jitsi",
                "Curriculum-aware AI Tutor",
                "Role-based Auth (Admin, Teacher, Student)"
            ]
        })

    # Catch-all for SPA frontend
    @app.route("/<path:path>")
    def catch_all(path):
        if static_folder and os.path.exists(os.path.join(static_folder, path)):
            return send_from_directory(static_folder, path)
        if static_folder and os.path.exists(os.path.join(static_folder, "index.html")):
            return send_from_directory(static_folder, "index.html")
        return jsonify({"error": "Not found", "path": path}), 404

    # Seed data on startup
    with app.app_context():
        try:
            seed_data.run_seed()
        except Exception as e:
            print(f"Seed note: {e}")

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"\n=======================================================")
    print(f"[*] VinnPro AI Education OS Backend Running on Port {port}")
    print(f"[+] Health Check: http://localhost:{port}/")
    print(f"[+] API Base:     http://localhost:{port}/api")
    print(f"=======================================================\n")
    app.run(host="0.0.0.0", port=port, debug=True)
