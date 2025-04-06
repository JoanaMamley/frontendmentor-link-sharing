from db import db

class LinkModel(db.Model):
    __tablename__ = "links"

    id = db.Column(db.Integer, primary_key=True)
    link_type = db.Column(db.String(80), unique=False, nullable=False)
    link_url = db.Column(db.String(150), unique=False, nullable=False)

    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False
    )
    user = db.relationship("UserModel", back_populates="links")