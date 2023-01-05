"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Comments } = require("../models/model.comments");
const { ActivityLog } = require("../models/model.activityLog");
const { validateCreateComment } = require("../validations/validation.comment");

let activityLog = {};

module.exports.createComment = async function (req) {
  try {
    winston.debug("Transaction started");

    // Validation
    const { error, value } = validateCreateComment(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the comments
    winston.info(`Registering Comments:`);

    const comments = new Comments(req.body);

    await comments.save();

    winston.info("Registered Comments successfully");

    return {
      status: true,
      data: comments,
      message: "Comments created successfully",
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

module.exports.getCommentByID = async function (id) {
  try {
    winston.info(`Getting information of comments: ${id}`);

    const comments = await Comments.findById(id);
    if (_.isEmpty(comments)) {
      winston.debug("Invalid Comments");
      return {
        status: false,
        data: null,
        message: "Invalid Comments",
        errorCode: 200,
      };
    }

    if (comments.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Comments Already Removed!",
        errorCode: 200,
      };
    }

    return { status: true, data: comments, message: "", errorCode: null };
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

module.exports.getAllComment = async function () {
  try {
    winston.info("Getting All Comments");

    const comments = await Comments.find({ isDeleted: false });
    if (_.isEmpty(comments)) {
      winston.debug();
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    return { status: true, data: comments, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateComment = async function (req) {
  try {
    winston.info("Update Comments");

    const comments = await Comments.findById(req.body._id);
    if (_.isEmpty(comments)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (comments.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Comments Already removed!",
        errorCode: 200,
      };
    }

    comments.message = req.body.message;

    comments.votes = req.body.votes;

    const updatedComments = await new Comments(comments).save();
    if (updatedComments) {
      activityLog.collectionName = "comments";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_commentss";
      activityLog.doc = updatedComments;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedComments,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteComment = async function (id) {
  try {
    winston.info("Delete Comments");

    const comments = await Comments.findById(id);
    if (_.isEmpty(comments)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (comments.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Comments Already removed!",
        errorCode: 200,
      };
    }

    const deletedComments = await Comments.findByIdAndUpdate(
      comments._id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
      },
      { new: true }
    );

    if (deletedComments) {
      activityLog.collectionName = "comments";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_comments";
      activityLog.doc = deletedComments;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedComments,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
