"use strict";
const _ = require("lodash");
const { UserRoles } = require("../models/admin/model.userRoles");

module.exports = async function (req, res, next) {	

	let role = await UserRoles.findOne({ roleId: req.user.userRole });

	if (_.toUpper(role.roleName) !== "ADMIN") {
		return res.status(403).send("Access denied.");
	}
	next();
};