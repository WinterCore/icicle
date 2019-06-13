import mongoose = require("mongoose");

import { mongodbServerUrl } from "../../../config/server";

mongoose.Promise = global.Promise;

async function ConnectToDatabase() {
	return new Promise((resolve, reject) => {
		const connection = mongoose.connection;
		mongoose.connect(mongodbServerUrl, { useNewUrlParser : true, useCreateIndex : true });
		connection.once("open", () => {
			resolve(mongoose);
		}).on("error", reject);
	});
}

export default ConnectToDatabase;