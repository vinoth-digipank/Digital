"use strict";
const winston = require("winston");
const mongoose = require("mongoose");
const nconf = require("nconf");

module.exports = function () {

	const db = nconf.get("db");

	mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			winston.info(`Connected to ${db}...`);
		});
};