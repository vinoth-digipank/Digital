"use strict";
const nconf = require("nconf");

module.exports = async function () {
  return nconf
    .argv()
    .env()
    .file({ file: __dirname + "/../../config/default-config.json" });
};
