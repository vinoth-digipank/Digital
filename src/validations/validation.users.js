"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateUser(users) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string()
      .min(3)
      .max(50)
      .optional()
      .allow("")
      .default("")
      .allow(null)
      .error(new Error("Enter valid name")),
    dob: Joi.date()
      .optional()
      .allow("")
      .default("")
      .allow(null)
      .optional()
      .error(new Error("Enter valid dob")),
    gender: Joi.string()
      .optional()
      .allow("")
      .default("")
      .allow(null)
      .error(new Error("Enter gender")),

    emailId: Joi.string()
      .email()
      .required()
      .error(new Error("Enter valid email Id")),
    mobileNumber: Joi.string()
      .min(5)
      .max(15)
      .allow("")
      .default("")
      .allow(null)
      .optional()
      .error(new Error("Enter valid mobile number")),
    mobileNumberCountryCode: Joi.string()
      .min(1)
      .max(15)
      .allow("")
      .default("")
      .allow(null)
      .optional()
      .error(new Error("Enter valid country code for mobile number")),
    phoneNumber: Joi.string().allow("").default("").allow(null).min(5).max(15),
    phoneNumberCountryCode: Joi.string()
      .allow("")
      .default("")
      .allow(null)
      .min(1)
      .max(15),
    password: Joi.string()
      .min(2)
      .max(300)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .required()
      .error(new Error("Enter valid password")),

    imageUrl: Joi.string().default("").allow("").allow(null),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    isDeleted: Joi.boolean().default(false),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(users, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateUser = validateCreateUser;
