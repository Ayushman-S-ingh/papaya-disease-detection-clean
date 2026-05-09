"""
app/services/prediction_service.py
Business logic for predictions: treatment lookup, severity mapping, score building
"""
from typing import Dict

# ── Treatment database ─────────────────────────────────────────────────────────
TREATMENT_DB: Dict[str, str] = {
    "Healthy Leaf": (
        "✅ No disease detected. Continue regular monitoring every 7–10 days. "
        "Maintain good agricultural practices: proper irrigation, balanced fertilization, "
        "and weed management to keep the plant healthy."
    ),
    "Papaya Ring Spot Virus": (
        "🚨 URGENT: Remove and destroy infected plants immediately to prevent spread. "
        "Control aphid vectors using neem oil spray (5ml/L) or imidacloprid 17.8SL (0.5ml/L). "
        "Plant virus-resistant varieties like Red Lady or Surya. Apply mineral oil spray weekly."
    ),
    "Powdery Mildew": (
        "⚠️ Apply sulfur-based fungicide (wettable sulfur 80WP at 2g/L) or "
        "potassium bicarbonate solution (1 tbsp/gallon). Improve air circulation by pruning. "
        "Avoid overhead irrigation. Apply neem oil (2%) as organic alternative."
    ),
    "Leaf Curl Disease": (
        "🚨 Manage whitefly vectors immediately using yellow sticky traps and "
        "imidacloprid 17.8SL (0.5ml/L). Remove severely infected leaves. "
        "Apply thiamethoxam 25WG at 0.3g/L. Maintain weed-free field borders."
    ),
    "Anthracnose": (
        "⚠️ Apply copper-based fungicide (copper oxychloride 50WP at 3g/L) or "
        "mancozeb 75WP at 2.5g/L. Improve drainage and reduce humidity. "
        "Remove infected fruits/leaves. Apply 2-3 sprays at 10-day intervals."
    ),
    "Phytophthora Blight": (
        "🆘 CRITICAL: Improve field drainage immediately. Apply metalaxyl-M 8%+mancozeb 64% "
        "(at 2.5g/L) or fosetyl-Al (at 3g/L). Avoid waterlogging. "
        "Apply soil drench around plant base. Repeat every 14 days until controlled."
    ),
    "Mosaic Virus": (
        "🚨 No direct cure. Control aphid vectors using reflective mulches and insecticides. "
        "Remove infected plants to reduce inoculum. Use certified disease-free seeds/seedlings. "
        "Apply insecticidal soap spray weekly."
    ),
    "Downy Mildew": (
        "⚠️ Apply mancozeb 75WP (2.5g/L) or cymoxanil+mancozeb (2g/L). "
        "Apply at first sign of disease; repeat every 7–10 days. "
        "Improve air circulation. Avoid overhead irrigation in evenings."
    ),
    "Bacterial Spot": (
        "⚠️ Apply copper hydroxide 53.8WG (1.5g/L) or streptomycin sulfate (200ppm). "
        "Avoid working in wet fields (spread via water splash). Remove crop debris. "
        "Apply 3-4 sprays at 7-day intervals."
    ),
    "Cercospora Leaf Spot": (
        "ℹ️ LOW PRIORITY. Apply mancozeb 75WP (2g/L) or carbendazim 50WP (1g/L). "
        "Remove and destroy fallen leaves. Maintain balanced fertilization (avoid excess N). "
        "Monitor every 2 weeks."
    ),
    "Yellow Crinkle Disease": (
        "🚨 Caused by phytoplasma. Apply oxytetracycline (500ppm) trunk injection. "
        "Control leafhopper vectors using malathion 50EC (2ml/L). "
        "Remove and destroy severely affected plants."
    ),
    "Nutrient Deficiency": (
        "ℹ️ Conduct soil and leaf tissue test to identify specific deficiency. "
        "Common deficiencies: N (yellowing) → urea 46% at 200g/plant; "
        "Fe (interveinal chlorosis) → ferrous sulfate foliar spray (5g/L); "
        "Mg → magnesium sulfate (10g/L) foliar. Adjust soil pH to 6.0–7.0."
    ),
}

SEVERITY_MAP = {
    "Healthy Leaf":              "none",
    "Cercospora Leaf Spot":      "low",
    "Nutrient Deficiency":       "low",
    "Powdery Mildew":            "medium",
    "Anthracnose":               "medium",
    "Downy Mildew":              "medium",
    "Bacterial Spot":            "medium",
    "Papaya Ring Spot Virus":    "high",
    "Leaf Curl Disease":         "high",
    "Mosaic Virus":              "high",
    "Yellow Crinkle Disease":    "high",
    "Phytophthora Blight":       "critical",
}


def get_treatment_recommendation(disease_name: str) -> str:
    return TREATMENT_DB.get(disease_name, "Consult a local agricultural extension officer.")


def get_severity(disease_name: str, confidence: float) -> str:
    base = SEVERITY_MAP.get(disease_name, "medium")
    # Downgrade severity if confidence is low
    if confidence < 0.65:
        order = ["none", "low", "medium", "high", "critical"]
        idx = order.index(base)
        return order[max(0, idx - 1)] if idx > 0 else base
    return base


def build_scores_dict(class_names, raw_scores) -> Dict[str, float]:
    return {name: float(score) for name, score in zip(class_names, raw_scores)}