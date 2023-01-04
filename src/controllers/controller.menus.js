"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Menus } = require("../models/model.menus");
const { ActivityLog } = require("../models/model.activityLog");
const { validateCreateMenu } = require("../validations/validation.menus");

let activityLog = {};

module.exports.createMenu = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user ? req.user._id : null;

    // Validation
    const { error, value } = validateCreateMenu(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the menu
    winston.info(`Registering Menus: ${req.body.emailId}`);

    const menu = new Menus(req.body);

    await menu.save();

    winston.info("Registered Menu successfully");

    return {
      status: true,
      data: menu,
      message: "Menu created successfully",
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

module.exports.getMenuByID = async function (id) {
  try {
    winston.info(`Getting information of menu: ${id}`);

    const menu = await Menus.findById(id);
    if (_.isEmpty(menu)) {
      winston.debug("Invalid Menu");
      return {
        status: false,
        data: null,
        message: "Invalid Menu",
        errorCode: 200,
      };
    }

    if (menu.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Menu Already Removed!",
        errorCode: 200,
      };
    }

    return { status: true, data: menu, message: "", errorCode: null };
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

module.exports.getAllMenu = async function () {
  try {
    winston.info("Getting All Menus");

    const menu = await Menus.find({ isDeleted: false });
    if (_.isEmpty(menu)) {
      winston.debug();
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    return { status: true, data: menu, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateMenu = async function (req) {
  try {
    winston.info("Update Menu");

    const menu = await Menus.findById(req.body._id);
    if (_.isEmpty(menu)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (menu.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Menu Already removed!",
        errorCode: 200,
      };
    }

    menu.menuName = req.body.menuName;

    menu.url = req.body.url;
    menu.enabled = req.body.enabled;

    menu.menuId = req.body.menuId;
    menu.pId = req.body.pId;

    menu.updatedBy = req.user._id;

    const updatedMenu = await new Menus(menu).save();
    if (updatedMenu) {
      activityLog.collectionName = "menus";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_menus";
      activityLog.doc = updatedMenu;

      await new ActivityLog(activityLog).save();
    }

    return { status: true, data: updatedMenu, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteMenu = async function (id, userReq) {
  try {
    winston.info("Update Menu");

    const menu = await Menus.findById(id);
    if (_.isEmpty(menu)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (menu.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Menu Already removed!",
        errorCode: 200,
      };
    }

    const deletedMenu = await Menus.findByIdAndUpdate(
      menu._id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        deletedBy: userReq._id,
      },
      { new: true }
    );

    if (deletedMenu) {
      activityLog.collectionName = "menus";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_menus";
      activityLog.doc = deletedMenu;

      await new ActivityLog(activityLog).save();
    }

    console.log("deletedMenu===.", deletedMenu);

    return { status: true, data: deletedMenu, message: "", errorCode: null };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
