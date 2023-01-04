"use strict";
const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware.auth");
const winston = require("winston");
const errMW = require("../middleware/middleware.error");

const {
  createUser,
  getAllUser,
  getUserByID,
  loginUser,
  deleteUser,
  updateUser,
} = require("../controllers/controller.users");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    winston.info("Logging in user");

    const result = await loginUser(req.body);
    if (result.status) {
      winston.info("Logged in User");
      return res
        .status(200)
        .send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res
          .status(result.errorCode)
          .send({
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

// CREATE USERs
router.post("/create", async (req, res) => {
  try {
    winston.info(`Creating Users : ${req.body.emailId}`);
    const result = await createUser(req);
    if (result.status) {
      return res
        .status(200)
        .send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res
          .status(result.errorCode)
          .send({
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

//Getting All Users
router.get("/all", [auth], async (req, res) => {
  try {
    winston.info("Getting All Users by query");
    const result = await getAllUser(req.body);
    if (result.status) {
      return res
        .status(200)
        .send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res
          .status(result.errorCode)
          .send({
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

//Getting User By ID
router.get("/:id", [auth], async (req, res) => {
  try {
    winston.info("Getting Users by ID");
    const result = await getUserByID(req.params.id);
    if (result.status) {
      return res
        .status(200)
        .send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res
          .status(result.errorCode)
          .send({
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

//delete user By ID
router.delete("/:id", [auth], async (req, res) => {
  try {
    winston.info("Deleting user by ID");
    const result = await deleteUser(req.params.id, req.user);
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

// UPDATE users
router.put("/update", [auth], async (req, res) => {
  try {
    winston.info(`Update Users `);
    const result = await updateUser(req);
    if (result.status) {
      return res
        .status(200)
        .send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res
          .status(result.errorCode)
          .send({
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
