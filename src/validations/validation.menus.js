"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateMenu(menus) {
  const joiSchema = Joi.object().keys({
    menuName: Joi.string().required().error(new Error("Enter valid menu name")),
    url: Joi.string().allow("").default("").allow(null).optional(),
    enabled: Joi.boolean().default(true).optional(),

    menuId: Joi.number()

      .required()
      .error(new Error("Enter valid menuid")),
    pId: Joi.number().required().error(new Error("Enter valid mobile number")),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    isDeleted: Joi.boolean().default(false),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(menus, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateMenu = validateCreateMenu;
