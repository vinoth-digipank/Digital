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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
    isDeleted: { type: Boolean, required: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
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


const Menus = mongoose.model("menus", menusSchema);

exports.Menus = Menus;

