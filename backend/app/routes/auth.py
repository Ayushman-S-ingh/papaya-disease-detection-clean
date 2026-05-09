"""
app/routes/auth.py
Authentication endpoints

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
"""

from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)

from ..models.user import User
from .. import db

auth_bp = Blueprint("auth", __name__)


# ─────────────────────────────────────────────
# REGISTER
# ─────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    required = ["name", "email", "password"]

    for field in required:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    existing_user = User.query.filter_by(
        email=data["email"].lower().strip()
    ).first()

    if existing_user:
        return jsonify({
            "error": "Email already registered"
        }), 409

    user = User(
        name=data["name"].strip(),
        email=data["email"].lower().strip(),
        role=data.get("role", "farmer"),
        phone=data.get("phone"),
        location=data.get("location"),
    )

    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    # JWT identity MUST be string
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    refresh_token = create_refresh_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Registration successful",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 201


# ─────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({
            "error": "Email and password required"
        }), 400

    user = User.query.filter_by(
        email=data["email"].lower().strip()
    ).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    if not user.is_active:
        return jsonify({
            "error": "Account is disabled"
        }), 403

    # JWT identity MUST be string
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    refresh_token = create_refresh_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 200


# ─────────────────────────────────────────────
# REFRESH TOKEN
# ─────────────────────────────────────────────
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():

    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    return jsonify({
        "access_token": access_token
    }), 200


# ─────────────────────────────────────────────
# CURRENT USER
# ─────────────────────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():

    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "user": user.to_dict()
    }), 200