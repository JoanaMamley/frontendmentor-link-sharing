from flask import jsonify
from flask.views import MethodView
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, jwt_required
from flask_smorest import Blueprint, abort
from schemas import UserAuthSchema, UserSchema
from models import UserModel
from passlib.hash import pbkdf2_sha256
from db import db
from blocklist import BLOCKLIST


blp = Blueprint("Users", "users", description="Operations on users")


@blp.route("/register", methods=["POST"])
class UserRegister(MethodView):
    @blp.arguments(UserAuthSchema)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.email == user_data["email"]).first():
            abort(409, message="A user with that email already exists.")

        user = UserModel(
            email=user_data["email"],
            password=pbkdf2_sha256.hash(user_data["password"]),
        )
        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully."}, 201


@blp.route("/user/<int:user_id>", methods=["GET", "DELETE", "PUT"])
class User(MethodView):
    """
    This resource can be useful when testing our Flask app.
    We may not want to expose it to public users, but for the
    sake of demonstration in this course, it can be useful
    when we are manipulating data regarding the users.
    """

    @blp.response(200, UserSchema)
    def get(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        return user

    @jwt_required(fresh=True)
    def delete(self, user_id):
        jwt = get_jwt()
        if not jwt.get("is_admin"):
            abort(401, message="Admin privilege required.")

        user = UserModel.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted."}, 200

    @jwt_required(fresh=True)
    @blp.arguments(UserSchema)
    @blp.response(200, UserSchema)
    def put(self, user_data, user_id):
        current_user_id = get_jwt_identity()

        # Check if the user is trying to access their own data
        if current_user_id != user_id and not get_jwt().get("is_admin"):
            abort(403, message="You do not have permission to access this resource.")

        user = UserModel.query.get(user_id)

        if user:
            user.email = user_data["email"]
            user.firstname = user_data["firstname"]
            user.lastname = user_data["lastname"]
        else:
            user = UserModel(id=user_id, **user_data)

        db.session.add(user)
        db.session.commit()

        return user

@blp.route("user/me", methods=["GET"])
class Me(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema)
    def get(self):
        user_id = get_jwt_identity()
        user = UserModel.query.get_or_404(user_id)
        return user

@blp.route("/login", methods=["POST"])
class UserLogin(MethodView):
    @blp.arguments(UserAuthSchema)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.email == user_data["email"]
        ).first()

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=str(user.id), fresh=True)
            refresh_token = create_refresh_token(str(user.id))

            # Set cookies with HTTPOnly, Secure and SameSite flags
            response = jsonify({"message": "Login successful"})
            response.set_cookie("access_token", access_token, httponly=True, samesite='Strict', max_age=3600, domain='127.0.0.1:4200')
            response.set_cookie("refresh_token", refresh_token, httponly=True, samesite='Strict', max_age=86400, domain='127.0.0.1:4200')
            return response, 200

        abort(401, message="Invalid credentials")


@blp.route("/logout", methods=["POST"])
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)

        response = jsonify({"message": "Logged out successfully"})
        # Delete cookies by setting their expiration date to a past date
        response.set_cookie("access_token", "", expires=0, httponly=True, samesite='Strict', domain='127.0.0.1:4200')
        response.set_cookie("refresh_token", "", expires=0, httponly=True, samesite='Strict', domain='127.0.0.1:4200')
        return response, 200

@blp.route("/refresh", methods=["POST"])
class TokenRefresh(MethodView):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=str(current_user), fresh=False)
        # Make it clear that when to add the refresh token to the blocklist will depend on the app design
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)

        response = jsonify({"access_token": new_access_token})
        response.set_cookie("access_token", new_access_token, httponly=True, samesite='Strict', max_age=3600, domain='127.0.0.1:4200')
        return response, 200