"use strict";
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    subHeader: { type: String, required: false },
    paragraphs: [{ type: String, required: false }],
    images: [{ type: String, required: false }],
    links: [{ type: String, required: false }],
  },
  { timestamps: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: false },
    content: [{ type: contentSchema, required: false }],
    votes: { type: Number, default: 0, required: false },
    isDraft: { type: Boolean, required: true },
    isPublished: { type: Boolean, required: true },
    publishedAt: { type: Date, required: false },
    tags: [{ type: String, required: false }],
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

blogSchema.pre("save", async function (next) {
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

const Blogs = mongoose.model("blogs", blogSchema);

exports.Blogs = Blogs;
