"use strict";
const bcrypt = require("bcryptjs");
const winston = require("winston");
const nodemailer = require("nodemailer");
const nconf = require("nconf");
// const { EmailTemplates } = require("../models/foundation/model.emailtemplate");
const fs = require("fs");
const ejs = require("ejs");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationfolder = "";
    switch (req.route.path) {
      case "/images/":
        destinationfolder = "images";
        break;
      default:
        destinationfolder = "images";
    }
    req.route.path === "/images"
      ? "images"
      : req.route.path === "/images"
      ? "images"
      : "";
    cb(null, "./src/uploads/" + destinationfolder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      shortid.generate() + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
module.exports.upload = multer({ storage: storage });

module.exports.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// module.exports.sendEmail = async function (
//   receiver,
//   _type,
//   options,
//   attachments
// ) {
//   try {
//     winston.info(`Sending an email to ${receiver}`);

//     const urls = nconf.get("urls");
//     // let template = await EmailTemplates.findOne({ _type: _type });

//     // if (!template) {
//     //   winston.debug(`Template of type : ${_type} not found`);
//     //   return { status: false, code: 200, data: "template not found" };
//     // }

//     if (!attachments) {
//       attachments = [];
//     }
//     // let transporter = nodemailer.createTransport({
//     //   host: nconf.get("emailHost"),
//     //   port: nconf.get("emailPort"),
//     //   auth: {
//     //     user: nconf.get("emailID"),
//     //     pass: nconf.get("emailPassword")
//     //   },
//     //   tls: {
//     //     rejectUnauthorized: false
//     //   }
//     // });

//     let emailConfig = nconf.get("email");
//     // let html;
//     let obj = { data: options, urls };

//     // html = template._body;

//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: emailConfig.id,
//         pass: emailConfig.password,
//       },
//     });

//     let mailOptions = {
//       from: emailConfig.id,
//       to: receiver,
//       subject: template._subject,
//       // html: template._body + ((options.content) ? options.content : "") + ((options.otp) ? options.otp : ""),
//       // html: html,
//       attachments,
//     };

//     let email = await transporter.sendMail(mailOptions);

//     winston.info("Sent email");
//     if (email.accepted.length === 0) {
//       winston.debug("Email not accepted");
//       return { status: false, data: "Email not accepted" };
//     }
//     return { status: true, data: "Email sent" };
//   } catch (error) {
//     console.log("error: ", error);
//     return { status: false, data: "Email not accepted" };
//   }
// };

module.exports.readJSON = async function (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function (error, data) {
      if (error) reject({ status: false, data: error });
      resolve({ status: true, data: JSON.parse(data) });
    });
  });
};

module.exports.writeJSON = async function (filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), function (error) {
      if (error)
        reject({ status: false, data: "Error writing file: " + error });
      resolve({ status: true, data: "file updated successfully!" });
    });
  });
};

module.exports.generateOTP = async function () {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports.getCurrentFYear = async () => {
  let fiscalyear = "";
  const today = new Date();
  if (today.getMonth() + 1 <= 3) {
    fiscalyear = today.getFullYear() - 1 + "-" + today.getFullYear();
  } else {
    fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1);
  }
  return fiscalyear;
};

module.exports.getCurrentFYearShort = async () => {
  let fiscalyear = "";
  const today = new Date();
  if (today.getMonth() + 1 <= 3) {
    fiscalyear = +today.getYear();
  } else {
    fiscalyear = +today.getYear() + 1;
  }
  return fiscalyear.toString().substring(1);
};
