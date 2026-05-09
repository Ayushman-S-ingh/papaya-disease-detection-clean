"""
app/models/prediction.py  —  Prediction record stored per inference
"""
from datetime import datetime
from .. import db


class Prediction(db.Model):
    __tablename__ = "predictions"

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    image_filename  = db.Column(db.String(255), nullable=False)
    image_url       = db.Column(db.String(500))
    disease_name    = db.Column(db.String(120), nullable=False)
    confidence      = db.Column(db.Float, nullable=False)       # 0.0 – 1.0
    severity        = db.Column(db.String(20))                  # low | medium | high | critical
    all_scores      = db.Column(db.JSON)                        # {class: score, ...}
    treatment       = db.Column(db.Text)
    notes           = db.Column(db.Text)
    leaf_area       = db.Column(db.Float)                       # optional px-based metric
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    user            = db.relationship("User", back_populates="predictions")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "image_url": self.image_url,
            "disease_name": self.disease_name,
            "confidence": round(self.confidence * 100, 2),
            "severity": self.severity,
            "all_scores": self.all_scores,
            "treatment": self.treatment,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
        }


class Disease(db.Model):
    """Static reference table for disease information and treatments."""
    __tablename__ = "diseases"

    id              = db.Column(db.Integer, primary_key=True)
    name            = db.Column(db.String(120), unique=True, nullable=False)
    category        = db.Column(db.String(60))           # fungal | bacterial | viral | deficiency
    description     = db.Column(db.Text)
    symptoms        = db.Column(db.Text)
    causes          = db.Column(db.Text)
    severity_level  = db.Column(db.String(20))           # low | medium | high | critical
    treatment_steps = db.Column(db.JSON)                 # ordered list of steps
    prevention      = db.Column(db.Text)
    chemical_control= db.Column(db.Text)
    organic_control = db.Column(db.Text)
    image_url       = db.Column(db.String(500))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "symptoms": self.symptoms,
            "causes": self.causes,
            "severity_level": self.severity_level,
            "treatment_steps": self.treatment_steps,
            "prevention": self.prevention,
            "chemical_control": self.chemical_control,
            "organic_control": self.organic_control,
        }