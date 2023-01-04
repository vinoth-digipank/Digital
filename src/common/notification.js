const FCM = require("fcm-node");
const nconf = require("nconf");
const fcmKey = nconf.get("fcmKey");
const winston = require("winston");

let fcm = new FCM(fcmKey);

const pushMultiple = async (devices, title, body, data) => {

	if (devices) {
		devices.forEach(device => {
			try {
				if (device.fcmToken !== undefined && device.fcmToken !== null) {

					var message = {
						//this may vary according to the message type (single recipient, multicast, topic, et cetera)
						to: device.fcmToken,
						// collapse_key: "123",

						notification: {
							title,
							body,
							icon: "http://localhost/3031/img/icon/menu/dashboard.png"
						},

						data: data
					};

					fcm.send(message, function (err, response) {
						if (err) {							
							winston.error("Something has gone wrong!", err);
						} else {
							winston.info("Successfully sent with response: ", response);
						}
					});
				}
			} catch (err) {
				winston.error("error: ", err);
			}
		});
	}
};

module.exports = {
	pushMultiple: async (devices, title, body, data) => {
		await pushMultiple(devices, title, body, data);
	}
};