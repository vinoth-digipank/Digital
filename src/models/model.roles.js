"use strict";
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true },
    menuId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "menus", required: true },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    isDeleted: { type: Boolean, required: false },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    deletedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

roleSchema.pre("save", async function (next) {
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

const Roles = mongoose.model("roles", roleSchema);

exports.Roles = Roles;
