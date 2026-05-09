from flask import Blueprint, jsonify

report_bp = Blueprint('report', __name__)

@report_bp.route('/report', methods=['GET'])
def report():
    return jsonify({
        "message": "Report API working"
    })