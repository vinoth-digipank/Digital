"use strict";
const crypto = require("crypto");
const nconf = require("nconf");

const algorithm = nconf.get("algorithm");
// const salt = "africanmedallion"//nconf.get("privateKey");
// const hash = crypto.createHash("sha1");
// hash.update(salt);

let key = "digital024681357";//hash.digest().slice(0, 32);
// key = key.substring(0, 16);
//const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

module.exports.encrypt = async function (text) {

	let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};


module.exports.decrypt = async function (text) {
	let iv = Buffer.from(text.iv, "hex");
	let encryptedText = Buffer.from(text.encryptedData, "hex");
	let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
};
