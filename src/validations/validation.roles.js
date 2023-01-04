"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateRole(roles) {
  const joiSchema = Joi.object().keys({
    roleName: Joi.string().required(),
    menuId: Joi.array().items(Joi.string().required()),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    isDeleted: Joi.boolean().default(false),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(roles, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateRole = validateCreateRole;
