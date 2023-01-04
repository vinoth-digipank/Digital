"use strict";
const jwt = require("jsonwebtoken");
const nconf = require("nconf");

module.exports = function (req, res, next) {
	const token = req.header("Authorization");
	if (!token) {
		return res.status(401).send("Access denied. No token provided.");
	}
	try {
		const decoded = jwt.verify(token, nconf.get("privateKey"));
		req.user = decoded;		
		next();
	}
	catch (ex) {		
		return res.status(400).send("Invalid token.");
	}
};