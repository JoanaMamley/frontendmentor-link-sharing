from flask.views import MethodView
from flask_jwt_extended import get_jwt, jwt_required
from flask_smorest import Blueprint, abort
from schemas import LinkSchema, LinkUpdateSchema
from models import LinkModel
from db import db
from sqlalchemy.exc import SQLAlchemyError

blp = Blueprint("Links", "links", description="Operations on links")


@blp.route("/link/<int:link_id>", methods=["GET", "DELETE", "PUT"])
class Link(MethodView):
    @jwt_required()
    @blp.response(200, LinkSchema)
    def get(self, link_id):
        link = LinkModel.query.get_or_404(link_id)
        return link

    @jwt_required(fresh=True)
    @jwt_required()
    def delete(self, link_id):
        link = LinkModel.query.get_or_404(link_id)
        db.session.delete(link)
        db.session.commit()
        return {"message": "Link deleted."}

    @jwt_required(fresh=True)
    @blp.arguments(LinkUpdateSchema)
    @blp.response(200, LinkSchema)
    def put(self, link_data, link_id):
        link = LinkModel.query.get(link_id)

        if link:
            link.link_type = link_data["link_type"]
            link.link_url = link_data["link_url"]
        else:
            link = LinkModel(id=link_id, **link_data)

        db.session.add(link)
        db.session.commit()

        return link


@blp.route("/link", methods=["POST"])
class LinkList(MethodView):
    @jwt_required(fresh=True)
    @blp.arguments(LinkSchema)
    @blp.response(201, LinkSchema)
    def post(self, link_data):
        link = LinkModel(**link_data)

        try:
            db.session.add(link)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while inserting the link.")

        return link

