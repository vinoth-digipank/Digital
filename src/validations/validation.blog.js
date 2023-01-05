"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateBlog(blogs) {
  const joiSchema = Joi.object().keys({
    title: Joi.string().required(),
    subTitle: Joi.string().optional().default(""),
    content: Joi.array().items({
      subHeader: Joi.string().optional().default(""),
      paragraphs: Joi.array().items(Joi.string().optional().default("")),
      links: Joi.array().items(Joi.string().optional().default("")),
      images: Joi.array().items(Joi.string().optional().default("")),
    }),
    votes: Joi.number().default(0).optional(),
    isDraft: Joi.boolean().required().default(false),
    isPublished: Joi.boolean().required().default(false),
    publishedAt: Joi.date().allow(""),
    tags: Joi.array().items(Joi.string().optional().default("")),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    isDeleted: Joi.boolean().default(false),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(blogs, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateBlog = validateCreateBlog;
