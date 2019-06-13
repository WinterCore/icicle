import { createLogger, transports, format } from "winston";
import { resolve } from "path";

const { combine, timestamp, label, printf } = format;

const logger = createLogger({
    format : combine(
        timestamp(),
        printf(({ message, timestamp, level, stack }) => `${timestamp} ${level}: ${message}\n${"-".repeat(100)}\n${stack}\n${"-".repeat(100)}`)
    ),
    transports : [
        new transports.Console(),
        new transports.File({ filename : resolve(process.cwd(), "logs", "error.log") })
    ]
});

export default logger;