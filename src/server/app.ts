import "source-map-support/register";

import databaseConnect  from "./database/connect";
import initializeServer from "./routes/init";

import logger from "./logger";


databaseConnect()
    .then(initializeServer)
    .catch(err => logger.error(err));
