"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Blogs } = require("../models/model.blog");
const { ActivityLog } = require("../models/model.activityLog");
const { validateCreateBlog } = require("../validations/validation.blog");

let activityLog = {};

module.exports.createBlog = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user ? req.user._id : null;
    req.body.updatedBy = null;
    req.body.deletedBy = null;

    // Validation
    const { error, value } = validateCreateBlog(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the blogs
    winston.info(`Registering Blogs: ${req.body.emailId}`);

    const blogs = new Blogs(req.body);

    await blogs.save();

    winston.info("Registered Blogs successfully");

    return {
      status: true,
      data: blogs,
      message: "Blogs created successfully",
      errorCode: null,
    };
  } catch (error) {
    winston.debug("Transaction failed");

    if (error.code === 11000) {
      return {
        status: false,
        data: null,
        message: "Already exists: " + JSON.stringify(error.keyValue),
        errorCode: 200,
      };
    }
    if (error.status && error.errorCode) {
      return error;
    }
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.getBlogByID = async function (id) {
  try {
    winston.info(`Getting information of blogs: ${id}`);

    const blogs = await Blogs.findById(id);
    if (_.isEmpty(blogs)) {
      winston.debug("Invalid Blogs");
      return {
        status: false,
        data: null,
        message: "Invalid Blogs",
        errorCode: 200,
      };
    }

    if (blogs.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Blogs Already Removed!",
        errorCode: 200,
      };
    }

    return { status: true, data: blogs, message: "", errorCode: null };
  } catch (error) {
    if (error.name === "CastError") {
      winston.debug("Invalid  ID");
      return {
        status: false,
        data: null,
        message: "Invalid  ID",
        errorCode: 200,
      };
    }
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.getBlogByUserID = async function (id) {
  try {
    winston.info(`Getting information of blogs: ${id}`);

    const blogs = await Blogs.find({ createdBy: id });
    if (_.isEmpty(blogs)) {
      winston.debug("Invalid Blogs");
      return {
        status: false,
        data: null,
        message: "Invalid Blogs",
        errorCode: 200,
      };
    }

    if (blogs.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Blogs Already Removed!",
        errorCode: 200,
      };
    }

    return { status: true, data: blogs, message: "", errorCode: null };
  } catch (error) {
    if (error.name === "CastError") {
      winston.debug("Invalid  ID");
      return {
        status: false,
        data: null,
        message: "Invalid  ID",
        errorCode: 200,
      };
    }
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.getAllBlog = async function () {
  try {
    winston.info("Getting All Blogs");

    const blogs = await Blogs.find({ isDeleted: false });
    if (_.isEmpty(blogs)) {
      winston.debug();
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    return { status: true, data: blogs, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBlog = async function (req) {
  try {
    winston.info("Update Blogs");

    const blogs = await Blogs.findById(req.body._id);
    if (_.isEmpty(blogs)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (blogs.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Blogs Already removed!",
        errorCode: 200,
      };
    }

    blogs.title = req.body.title;
    blogs.subTitle = req.body.subTitle;
    blogs.content = req.body.content;
    blogs.votes = req.body.votes;
    blogs.isDraft = req.body.isDraft;
    blogs.isPublished = req.body.isPublished;
    if (req.body.isPublished && !blogs.isPublished) {
      blogs.publishedAt = Date.now();
    }
    blogs.tags = req.body.tags;

    blogs.updatedBy = req.user._id;

    const updatedBlogs = await new Blogs(blogs).save();
    if (updatedBlogs) {
      activityLog.collectionName = "blogs";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_blogss";
      activityLog.doc = updatedBlogs;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: updatedBlogs, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteBlog = async function (id, userReq) {
  try {
    winston.info("Delete Blogs");

    const blogs = await Blogs.findById(id);
    if (_.isEmpty(blogs)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (blogs.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Blogs Already removed!",
        errorCode: 200,
      };
    }

    const deletedBlogs = await Blogs.findByIdAndUpdate(
      blogs._id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        deletedBy: userReq._id,
      },
      { new: true }
    );

    if (deletedBlogs) {
      activityLog.collectionName = "blogs";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_blogs";
      activityLog.doc = deletedBlogs;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: deletedBlogs, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
