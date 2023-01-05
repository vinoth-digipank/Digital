"use strict";
const winston = require("winston");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { Users } = require("../models/model.users");
const { hashPassword } = require("../common/helper");
const { ActivityLog } = require("../models/model.activityLog");
const { validateCreateUser } = require("../validations/validation.users");

let activityLog = {};

module.exports.createUser = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.password = await hashPassword(req.body.password);
    req.body.createdBy = req.user ? req.user._id : null;
    req.body.updatedBy = null;
    req.body.deletedBy = null;
    // Validation
    const { error, value } = validateCreateUser(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the user
    winston.info(`Registering Users: ${req.body.emailId}`);

    const user = new Users(req.body);

    await user.save();

    winston.info("Registered User successfully");

    return {
      status: true,
      data: _.pick(user, [
        "_id",
        "name",
        "emailId",
        "mobileNumber",
        "mobileNumberCountryCode",
        "userName",
      ]),
      message: "User created successfully",
      errorCode: null,
    };
  } catch (error) {
    winston.debug("Transaction failed");
    // await session.abortTransaction();
    // session.endSession();
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

module.exports.getUserByID = async function (id) {
  try {
    winston.info(`Getting information of user: ${id}`);

    let user = await Users.findById(id);
    if (_.isEmpty(user)) {
      winston.debug("Invalid User");
      return {
        status: false,
        data: null,
        message: "Invalid User",
        errorCode: 200,
      };
    }

    if (user.isDeleted) {
      return {
        status: false,
        data: null,
        message: "User Already Removed!",
        errorCode: 200,
      };
    }

    user = _.omit(user.toObject(), "password");
    return { status: true, data: user, message: "", errorCode: null };
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

module.exports.getAllUser = async function () {
  try {
    winston.info("Getting All Users");

    let user = await Users.find({ isDeleted: false });
    if (_.isEmpty(user)) {
      winston.debug();
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    let users = _.map(user, function (o) {
      return _.omit(o, "password");
    });
    return { status: true, data: users, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.loginUser = async function (body) {
  try {
    let user;
    let userArr = await Users.aggregate([
      {
        $project: {
          name: 1,
          emailId: 1,
          mobileNumber: 1,
          mobileNumberCountryCode: 1,
          password: 1,
          phoneNumber: 1,
          phoneNumberCountryCode: 1,
          isDeleted: 1,
          imageUrl: 1,
          mobile: { $concat: ["$mobileNumberCountryCode", "$mobileNumber"] },
        },
      },
      {
        $match: {
          emailId: body.emailId.trim(),
        },
      },
    ]);

    // Checking if user exists
    if (userArr.length === 0) {
      winston.debug("User not found");
      return {
        status: false,
        data: null,
        message: "Invalid Email / Password",
        errorCode: 200,
      };
    } else {
      user = userArr[0];
    }

    // Checking if user is removed
    if (user.isDeleted) {
      winston.debug(`The user ${user.name} does not exists`);
      return {
        status: false,
        data: null,
        message: "Your account is closed!",
        errorCode: 200,
      };
    }

    // Checking password
    let isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      winston.debug("Password does not match");
      return {
        status: false,
        data: null,
        message: "Invalid Email / Password",
        errorCode: 200,
      };
    }

    // Generating token
    let userNew = new Users(user);
    const { token, exp } = userNew.generateToken();
    winston.debug(`Token: ${token}`);

    activityLog.collectionName = "users";
    activityLog.type = "LOGIN";
    activityLog.operation = "login_users";
    activityLog.doc = userNew;

    await new ActivityLog(activityLog).save();

    return {
      status: true,
      data: {
        user: _.pick(userNew, [
          "_id",
          "name",
          "emailId",
          "mobileNumberCountryCode",
          "mobileNumber",
          "isDeleted",
          "imageUrl",
        ]),
        token,
        exp,
      },
      message: "Login Successful",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateUser = async function (req) {
  try {
    winston.info("Update User");

    const user = await Users.findById(req.body._id);
    if (_.isEmpty(user)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (user.isDeleted) {
      return {
        status: false,
        data: null,
        message: "User Already removed!",
        errorCode: 200,
      };
    }

    user.name = req.body.name;

    user.dob = req.body.dob;
    user.gender = req.body.gender;

    user.mobileNumber = req.body.mobileNumber;
    user.mobileNumberCountryCode = req.body.mobileNumberCountryCode;
    user.phoneNumber = req.body.phoneNumber;
    user.phoneNumberCountryCode = req.body.phoneNumberCountryCode;
    user.imageUrl = req.body.imageUrl;
    user.updatedBy = req.user._id;

    let updatedUser = await new Users(user).save();
    if (updatedUser) {
      activityLog.collectionName = "users";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_users";
      activityLog.doc = updatedUser;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: updatedUser, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteUser = async function (id, userreq) {
  try {
    winston.info("Update User");

    const user = await Users.findById(id);
    if (_.isEmpty(user)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (user.isDeleted) {
      return {
        status: false,
        data: null,
        message: "User Already removed!",
        errorCode: 200,
      };
    }

    user.isDeleted = true;

    user.deletedAt = Date.now();
    user.deletedBy = userreq._id;

    let deletedUser = await new Users(user).save();
    if (deletedUser) {
      activityLog.collectionName = "users";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_users";
      activityLog.doc = deletedUser;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: deletedUser, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
