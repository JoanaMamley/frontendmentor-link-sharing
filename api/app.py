import os
import secrets
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from db import db
from flask_smorest import Api
from blocklist import BLOCKLIST
from resources import UserBlueprint, LinkBlueprint
from flask_smorest import Blueprint
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()  # This loads .env variables into os.environ

api_bp = Blueprint('api', __name__, url_prefix='/api')

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {
        "origins": "http://localhost:4200",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})
    app.config["API_TITLE"] = "Link Share REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config[
        "OPENAPI_SWAGGER_UI_URL"
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    username = os.environ.get("DB_USERNAME")
    password = os.environ.get("DB_PASSWORD")
    host = os.environ.get("DB_HOST", "localhost")  # Default to localhost if not set
    db_name = os.environ.get("LINK_SHARE_DB")

    if username and password and db_name:
        app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{username}:{password}@{host}/{db_name}"
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    else:
        raise EnvironmentError("Database credentials not found in environment variables.")

    app.config["PROPAGATE_EXCEPTIONS"] = True
    db.init_app(app)
    api = Api(app)

    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
    jwt = JWTManager(app)

    @jwt.additional_claims_loader
    def add_claims_to_jwt(identity):
        if int(identity) == 1:
            return {"is_admin": True}
        return {"is_admin": False}

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({"message": "The token has expired.", "error": "token_expired"}),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        """
        Callback function triggered when an invalid token is provided.
        Returns a JSON response with an error message and a 401 status code.
        """
        return (
            jsonify(
                {"message": "Signature verification failed.", "error": "invalid_token"}
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        #  should lead to the login page
        return (
            jsonify(
                {
                    "description": "Request does not contain an access token.",
                    "error": "authorization_required",
                }
            ),
            401,
        )

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST


    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        #  should lead to the login page
        return (
            jsonify(
                {"description": "The token has been revoked.", "error": "token_revoked"}
            ),
            401,
        )

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        #  should lead to the login page
        return (
            jsonify(
                {
                    "description": "The token is not fresh.",
                    "error": "fresh_token_required",
                }
            ),
            401,
        )

    with app.app_context():
        db.create_all()


    api_bp.register_blueprint(UserBlueprint)
    api_bp.register_blueprint(LinkBlueprint)
    api.register_blueprint(api_bp)

    return app