"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateComment(blogs) {
  const joiSchema = Joi.object().keys({
    message: Joi.string().required(),
    blogId: joiObjectId().allow(null).allow(""),
    votes: Joi.number().default(0).optional(),
    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    isDeleted: Joi.boolean().default(false),

    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(blogs, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateComment = validateCreateComment;
