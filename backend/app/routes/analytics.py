from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_jwt
)

from sqlalchemy import func

from ..models.prediction import Prediction


analytics_bp = Blueprint(
    "analytics",
    __name__
)


@analytics_bp.route("", methods=["GET"])
@jwt_required()
def get_analytics():

    user_id = int(get_jwt_identity())

    claims = get_jwt()

    is_admin = claims.get("role") == "admin"

    # =========================
    # QUERY
    # =========================
    if is_admin:

        query = Prediction.query

    else:

        query = Prediction.query.filter_by(
            user_id=user_id
        )

    predictions = query.all()

    total_predictions = len(predictions)

    healthy_predictions = len([
        p for p in predictions
        if "healthy" in p.disease_name.lower()
    ])

    disease_predictions = (
        total_predictions - healthy_predictions
    )

    # =========================
    # DISEASE BREAKDOWN
    # =========================
    breakdown_query = query.with_entities(
        Prediction.disease_name,
        func.count(Prediction.id)
    ).group_by(
        Prediction.disease_name
    ).all()

    disease_breakdown = []

    for disease_name, count in breakdown_query:

        percentage = 0

        if total_predictions > 0:

            percentage = round(
                (count / total_predictions) * 100,
                2
            )

        disease_breakdown.append({
            "name": disease_name,
            "count": count,
            "percentage": percentage
        })

    return jsonify({

        "total_predictions": total_predictions,

        "healthy_predictions": healthy_predictions,

        "disease_predictions": disease_predictions,

        "disease_breakdown": disease_breakdown

    }), 200