"""
app/models/user.py  —  User model with roles
"""
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .. import db


class User(db.Model):
    __tablename__ = "users"

    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(120), nullable=False)
    email        = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash= db.Column(db.String(255), nullable=False)
    role         = db.Column(db.String(20), nullable=False, default="farmer")  # farmer | admin
    is_active    = db.Column(db.Boolean, default=True)
    phone        = db.Column(db.String(20))
    location     = db.Column(db.String(120))
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    predictions  = db.relationship("Prediction", back_populates="user", lazy="dynamic")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "phone": self.phone,
            "location": self.location,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.email}>"