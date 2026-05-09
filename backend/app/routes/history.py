"""
app/routes/history.py
Prediction History Routes
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import desc

from ..models.prediction import Prediction
from .. import db


history_bp = Blueprint("history", __name__)


# ==========================================
# GET ALL HISTORY
# ==========================================
@history_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():

    try:

        page = request.args.get("page", 1, type=int)

        per_page = request.args.get(
            "per_page",
            10,
            type=int
        )

        search = request.args.get("search", "")

        severity = request.args.get(
            "severity",
            ""
        )

        sort = request.args.get(
            "sort",
            "newest"
        )

        query = Prediction.query

        # SEARCH
        if search:

            query = query.filter(
                Prediction.disease_name.ilike(
                    f"%{search}%"
                )
            )

        # SEVERITY
        if severity:

            query = query.filter(
                Prediction.severity == severity
            )

        # SORT
        if sort == "oldest":

            query = query.order_by(
                Prediction.created_at.asc()
            )

        elif sort == "confidence_high":

            query = query.order_by(
                Prediction.confidence.desc()
            )

        else:

            query = query.order_by(
                desc(Prediction.created_at)
            )

        paginated = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return jsonify({

            "predictions": [
                p.to_dict()
                for p in paginated.items
            ],

            "total": paginated.total,

            "pages": paginated.pages,

            "current_page": page,

            "has_next": paginated.has_next,

            "has_prev": paginated.has_prev

        }), 200

    except Exception as e:

        print("HISTORY ERROR:", str(e))

        return jsonify({
            "error": "Failed to fetch history"
        }), 500


# ==========================================
# GET SINGLE PREDICTION
# ==========================================
@history_bp.route(
    "/history/<int:prediction_id>",
    methods=["GET"]
)
@jwt_required()
def get_single(prediction_id):

    try:

        pred = Prediction.query.get(
            prediction_id
        )

        if not pred:

            return jsonify({
                "error": "Prediction not found"
            }), 404

        return jsonify(
            pred.to_dict()
        ), 200

    except Exception as e:

        print("DETAIL ERROR:", str(e))

        return jsonify({
            "error": "Failed to load prediction"
        }), 500


# ==========================================
# DELETE PREDICTION
# ==========================================
@history_bp.route(
    "/history/<int:prediction_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_prediction(prediction_id):

    try:

        pred = Prediction.query.get(
            prediction_id
        )

        if not pred:

            return jsonify({
                "error": "Prediction not found"
            }), 404

        db.session.delete(pred)

        db.session.commit()

        return jsonify({
            "message": "Prediction deleted successfully"
        }), 200

    except Exception as e:

        print("DELETE ERROR:", str(e))

        return jsonify({
            "error": "Delete failed"
        }), 500