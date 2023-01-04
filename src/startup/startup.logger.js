"use strict";
const winston = require("winston");
const nconf = require("nconf");
require("winston-daily-rotate-file");
require("winston-mail").Mail;
const moment = require("moment");

const path = require("path");

nconf
  .argv()
  .env()
  .file({ file: __dirname + "/../config/default-config.json" });

const emailConfig = nconf.get("email");
const logReport = nconf.get("logReport");

module.exports = function () {
  let logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  );

  winston.add(
    new winston.transports.Console({
      level: "silly",
      handleExceptions: true,
      format: winston.format.combine(
        logFormat,
        winston.format.colorize({ all: true })
      ),
    })
  );

  //if (process.env.NODE_ENV === "production") {

  winston.add(
    new winston.transports.DailyRotateFile({
      format: logFormat,
      datePattern: "YYYY-MM-DD",
      filename: path.join(__dirname, "../logs/error-%DATE%.log"),
      level: "error",
      zippedArchive: true,
      maxSize: "1kb",
      handleExceptions: true,
      humanReadableUnhandledException: true,
      // maxFiles: '1s'
    })
  );

  winston.add(
    new winston.transports.DailyRotateFile({
      format: logFormat,
      datePattern: "YYYY-MM-DD",
      filename: path.join(__dirname, "../logs/combined-%DATE%.log"),
      level: "silly",
      zippedArchive: true,
      maxSize: "1kb",
      handleExceptions: true,
      humanReadableUnhandledException: true,
      // maxFiles: '1d'
    })
  );

//   winston.add(
//     new winston.transports.Mail({
//       level: "error",
//       handleExceptions: true,
//       //  	format: logFormat,
//       to: logReport.to,
//       from: emailConfig.id,
//       subject:
//         "Reg. SFT Log Report - " +
//         moment().format("hh:mm:ss.SSS A, DD MMM YYYY "),
//       username: emailConfig.id,
//       password: emailConfig.password,
//       host: emailConfig.host,
//       ssl: true,
//       formatter: (info) => {
//         let message = info.message;
//         let level = info.level;
//         return (
//           "Dear Team!\n\n The following " + level + " occured. \n\n" + message
//         );
//       },
//     })
//   );

  winston.info("PRODUCTION MODE");
  //}
};
