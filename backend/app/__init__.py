"""
app/__init__.py
Flask application factory
"""

import os

from flask import (
    Flask,
    send_from_directory,
    request,
    make_response
)

from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy

from flask_migrate import Migrate

from flask_jwt_extended import JWTManager

from .config import Config


db = SQLAlchemy()

migrate = Migrate()

jwt = JWTManager()


def create_app(config_class=Config):

    app = Flask(__name__)

    app.config.from_object(config_class)

    # =========================
    # EXTENSIONS
    # =========================

    db.init_app(app)

    migrate.init_app(app, db)

    jwt.init_app(app)

    # =========================
    # CORS
    # =========================

    CORS(
        app,
        origins=[
            "http://localhost:5173",
            "https://papaya-frontend-nqx2.onrender.com",
            "http://localhost",
            "https://localhost",
            "capacitor://localhost"
        ],
        supports_credentials=True
    )

    # =========================
    # HANDLE PREFLIGHT REQUESTS
    # =========================

    @app.before_request
    def handle_preflight():

        if request.method == "OPTIONS":

            response = make_response()

            response.headers.add(
                "Access-Control-Allow-Origin",
                "*"
            )

            response.headers.add(
                "Access-Control-Allow-Headers",
                "Content-Type,Authorization"
            )

            response.headers.add(
                "Access-Control-Allow-Methods",
                "GET,POST,PUT,DELETE,OPTIONS"
            )

            return response

    # =========================
    # SERVE UPLOADED IMAGES
    # =========================

    @app.route("/api/uploads/<filename>")
    def uploaded_file(filename):

        upload_folder = os.path.join(
            os.getcwd(),
            "uploads"
        )

        return send_from_directory(
            upload_folder,
            filename
        )

    # =========================
    # IMPORT BLUEPRINTS
    # =========================

    from .routes.auth import auth_bp

    from .routes.predict import predict_bp

    from .routes.history import history_bp

    from .routes.analytics import analytics_bp

    from .routes.report import report_bp

    from .routes.admin import admin_bp

    # =========================
    # REGISTER BLUEPRINTS
    # =========================

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        predict_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        history_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        analytics_bp,
        url_prefix="/api/analytics"
    )

    app.register_blueprint(
        report_bp,
        url_prefix="/api/report"
    )

    app.register_blueprint(
        admin_bp,
        url_prefix="/api/admin"
    )

    # =========================
    # HEALTH CHECK
    # =========================

    @app.route("/api/health")
    def health():

        return {
            "status": "healthy",
            "version": "1.0.0"
        }

    # =========================
    # MANUAL CORS HEADERS
    # =========================

    @app.after_request
    def after_request(response):

        response.headers.add(
            "Access-Control-Allow-Origin",
            "*"
        )

        response.headers.add(
            "Access-Control-Allow-Headers",
            "Content-Type,Authorization"
        )

        response.headers.add(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,DELETE,OPTIONS"
        )

        return response

    return app