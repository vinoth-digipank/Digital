"use strict";
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
	collectionName: { type: String, required: true },
	type: { type: String, required: true },
	operation: { type: String },
	doc: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const ActivityLog = mongoose.model("activitylogs", activitySchema);

module.exports.ActivityLog = ActivityLog;
