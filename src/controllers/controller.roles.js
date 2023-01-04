"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Roles } = require("../models/model.roles");
const { ActivityLog } = require("../models/model.activityLog");
const { validateCreateRole } = require("../validations/validation.roles");

let activityLog = {};

module.exports.createRole = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user ? req.user._id : null;

    // Validation
    const { error, value } = validateCreateRole(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the roles
    winston.info(`Registering Roles: ${req.body.emailId}`);

    const roles = new Roles(req.body);

    await roles.save();

    winston.info("Registered Roles successfully");

    return {
      status: true,
      data: roles,
      message: "Roles created successfully",
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

module.exports.getRoleByID = async function (id) {
  try {
    winston.info(`Getting information of roles: ${id}`);

    const roles = await Roles.findById(id);
    if (_.isEmpty(roles)) {
      winston.debug("Invalid Roles");
      return {
        status: false,
        data: null,
        message: "Invalid Roles",
        errorCode: 200,
      };
    }

    if (roles.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Roles Already Removed!",
        errorCode: 200,
      };
    }

    return { status: true, data: roles, message: "", errorCode: null };
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

module.exports.getAllRole = async function () {
  try {
    winston.info("Getting All Roles");

    const roles = await Roles.find({ isDeleted: false });
    if (_.isEmpty(roles)) {
      winston.debug();
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    return { status: true, data: roles, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateRole = async function (req) {
  try {
    winston.info("Update Roles");

    const roles = await Roles.findById(req.body._id);
    if (_.isEmpty(roles)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (roles.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Roles Already removed!",
        errorCode: 200,
      };
    }

    roles.roleName = req.body.roleName;

    roles.menuId = req.body.menuId;

    roles.updatedBy = req.user._id;

    const updatedRoles = await new Roles(roles).save();
    if (updatedRoles) {
      activityLog.collectionName = "roles";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_roless";
      activityLog.doc = updatedRoles;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: updatedRoles, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteRole = async function (id, userReq) {
  try {
    winston.info("Update Roles");

    const roles = await Roles.findById(id);
    if (_.isEmpty(roles)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (roles.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Roles Already removed!",
        errorCode: 200,
      };
    }

    const deletedRoles = await Roles.findByIdAndUpdate(
      roles._id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        deletedBy: userReq._id,
      },
      { new: true }
    );

    if (deletedRoles) {
      activityLog.collectionName = "roles";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_roles";
      activityLog.doc = deletedRoles;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: deletedRoles, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
