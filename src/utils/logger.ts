import { createLogger, format, transports } from "winston";
import { env } from "@/env.mjs";

const logDir = env.LOG_DIR;
const logLevel = env.NODE_ENV === "development" ? "debug" : "info";
const defaultFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp as string} ${level}: ${message as string}`
  )
);

// Initialize winston logger
export const logger = createLogger({
  level: logLevel,
  format: defaultFormat,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(
          ({ timestamp, level, message }) => `${timestamp as string} ${level}: ${message as string}`
        )
      ),
    }),
    new transports.File({
      filename: `${logDir}/combined.log`,
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: `${logDir}/rejections.log`,
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: `${logDir}/exceptions.log`,
    }),
  ],
});

export const dbLogger = createLogger({
  level: logLevel,
  format: defaultFormat,
  transports: [
    new transports.File({
      filename: `${logDir}/db/dbGeneral.log`,
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: `${logDir}/db/dbRejections.log`,
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: `${logDir}/db/dbExceptions.log`,
    }),
  ],
});
