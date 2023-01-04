"use strict";
const express = require("express");
const winston = require("winston");
const nconf = require("nconf");
const app = express();
const server = require("http").createServer(app);
const partials = require("express-partials");

app.use((req, res, next) => {
  next();
});

app.use(partials());

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.send("welcome to digital");
});

require("./startup/startup.logger")();
require("./startup/startup.config")();
require("./startup/startup.db")();
require("./startup/startup.routes")(app);

app.listen(nconf.get("port"), () => {
  winston.info(`Listening on port: ${nconf.get("port")}`);
});

module.exports = server;
