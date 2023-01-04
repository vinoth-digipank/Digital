"use strict";
const winston = require("winston");
const jwt = require("jsonwebtoken");
const nconf = require("nconf");
const _ = require("lodash");

module.exports = function (err, req, res) {

	try {
		const token = req.header("Authorization");
		let user;

		if (token) {
			const decoded = jwt.verify(token, nconf.get("privateKey"));
			user = decoded;
		}
		// console.log('\nURL: ' + req.originalUrl + '\nIP: ' + req.ip + '\nMethod: ' + req.method, +'\nPath: ' + req.path + '\nUser: ' + JSON.stringify(user) + '\nMessage: ' + err.message + '\nVerbose: ' + err);
		winston.error("\nInstance: \"DEVELOPMENT" + "\nURL: " + req.originalUrl + "\nIP: " + req.ip + "\nMethod: " + req.method + "\nPath: " + req.path + "\nUser: " + JSON.stringify(_.omit(user, "_id")) + "\nMessage: " + err.message + "\nVerbose: " + err);

		res.status(200).send({ status: false, data: { message: err.message } });
	} catch (err) {
		return res.status(400).send("Error in middleware error" + err);
	}
};