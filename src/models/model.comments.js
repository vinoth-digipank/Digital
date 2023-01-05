"use strict";
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
    votes: { type: Number, default: 0, required: false },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: false,
    // },
    // updatedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: false,
    // },
    isDeleted: { type: Boolean, required: false },
    // deletedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: false,
    // },
    deletedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

commentSchema.pre("save", async function (next) {
  let now = Date.now();

  this.isDeleted = false;
  // this.deletedBy = "";
  this.deletedAt = "";

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const Comments = mongoose.model("comments", commentSchema);

exports.Comments = Comments;
