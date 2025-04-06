from marshmallow import Schema, fields

class PlainUserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Str(required=True)

class PlainLinkSchema(Schema):
    id = fields.Int(dump_only=True)
    link_type = fields.Str(required=True)
    link_url = fields.Str(required=True)

class UserAuthSchema(PlainUserSchema):
    password = fields.Str(required=True, load_only=True)

class UserSchema(PlainUserSchema):
    lastname = fields.Str(required=True)
    firstname = fields.Str(required=True)
    links = fields.List(fields.Nested(PlainLinkSchema()), dump_only=True)

class LinkSchema(PlainLinkSchema):
    user_id = fields.Int(required=True, load_only=True)
    user = fields.Nested(PlainUserSchema(), dump_only=True)

class LinkUpdateSchema(Schema):
    link_type = fields.Str()
    link_url = fields.Str()