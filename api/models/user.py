from db import db

class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(100), nullable=True)
    firstname = db.Column(db.String(100), nullable=True)
    profile_image_path = db.Column(db.String(255), nullable=True)
    links = db.relationship("LinkModel", back_populates="user", lazy="dynamic")