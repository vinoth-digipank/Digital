"use strict";
const express = require("express");

const users = require("../routes/route.users");
const roles = require("../routes/route.roles");
const menus = require("../routes/route.menus");
const blogs = require("../routes/route.blog");
const comments = require("../routes/route.comment");

const cors = require("cors");

const corsOptions = function (req, callback) {
  var corsOptions = {
    origin: "*",
    exposedHeaders: "x-auth-token",
  };
  callback(null, corsOptions);
};

module.exports = function (app) {
  app.use(express.json({ limit: "50mb" }));
  app.use(cors(corsOptions));
  app.use("/default", express.static("public/images"));
  // app.use("/css", express.static("public/css"));

  app.use("/api/users", users);
  app.use("/api/roles", roles);
  app.use("/api/menus", menus);
  app.use("/api/blogs", blogs);
  app.use("/api/comments", comments);

  // app.use(error);
};
