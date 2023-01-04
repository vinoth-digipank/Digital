"use strict";
// const Joi = require("joi");
const mongoose = require("mongoose");

const menusSchema = new mongoose.Schema(
  {
    menuName: { type: String, required: true },
    url: { type: String, required: true },
    enabled: { type: Boolean, required: false },
    menuId: { type: Number, required: true },
    pId: { type: Number, required: true },
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false },
    isDeleted: { type: Boolean, required: false },
    deletedBy: { type: String, required: false },
    deletedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

menusSchema.pre("save", async function (next) {
  let now = Date.now();

  this.isDeleted = false;
  this.deletedBy = "";
  this.deletedAt = "";

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

// function validateMenus(menus) {
// 	const joiSchema = Joi.object().keys({
// 		_id: Joi.string(),
// 		menuName: Joi.string().required().error(new Error("Enter valid menu name")),
// 		url: Joi.string().error(new Error("Enter valid URL")),
// 		enabled: Joi.boolean().default(true),
// 		roles: Joi.string().required().error(new Error("Enter valid roles")),
// 		subItem: Joi.array().items({
// 			menuName: Joi.string().optional(),
// 			url: Joi.string().optional(),
// 			enabled: Joi.boolean().default(true).optional(),
// 			roles: Joi.string().optional(),
// 			subItem: Joi.array().items({
// 				menuName: Joi.string().optional(),
// 				url: Joi.string().optional(),
// 				enabled: Joi.boolean().default(true).optional(),
// 				roles: Joi.string().optional(),
// 			}).optional()
// 		}).optional(),
// 		menuId: Joi.number().required().error(new Error("Enter valid menuId")),
// 		pId: Joi.number().required().error(new Error("Enter valid pId")),
// 		createdBy: Joi.string().allow(""),
// 		createdAt: Joi.date().allow(""),
// 		updatedBy: Joi.string().allow(""),
// 		updatedAt: Joi.date().allow(""),
// 		isDeleted: Joi.boolean().allow(""),
// 		deletedBy: Joi.string().allow(""),
// 		deletedAt: Joi.date().allow(""),
// 		currentUser: Joi.string().required()
// 	});
// 	return Joi.validate(menus, joiSchema, function (err) {
// 		if (err) {
// 			return err.message;
// 		}
// 	});
// }

const Menus = mongoose.model("menus", menusSchema);

exports.Menus = Menus;
// exports.validateMenus = validateMenus;
