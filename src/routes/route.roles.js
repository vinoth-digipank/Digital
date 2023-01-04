"use strict";
const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware.auth");
const winston = require("winston");
const errMW = require("../middleware/middleware.error");

const {
  createRole,
  getAllRole,
  getRoleByID,
  deleteRole,
  updateRole,
} = require("../controllers/controller.roles");

// CREATE Roles
router.post("/create", [auth], async (req, res) => {
  try {
    winston.info(`Creating Roles`);
    const result = await createRole(req);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

//Getting All Roles
router.get("/all", [auth], async (req, res) => {
  try {
    winston.info("Getting All Roles by query");
    const result = await getAllRole(req.body);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

//Getting Role By ID
router.get("/:id", [auth], async (req, res) => {
  try {
    winston.info("Getting Roles by ID");
    const result = await getRoleByID(req.params.id);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

//delete role By ID
router.delete("/:id", [auth], async (req, res) => {
  try {
    winston.info("Deleting role by ID");
    const result = await deleteRole(req.params.id, req.user);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

// UPDATE roles
router.put("/update", [auth], async (req, res) => {
  try {
    winston.info(`Update Roles `);
    const result = await updateRole(req);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

module.exports = router;
