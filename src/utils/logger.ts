import { createLogger, type LoggerOptions, format, transports } from "winston";
import { env } from "@/env.mjs";

const logDir = env.LOG_DIR ?? "logs";
const logLevel = env.NODE_ENV === "development" ? "debug" : "info";
const defaultFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp as string} ${level}: ${message as string}`
  )
);

const loggerTransports: NonNullable<LoggerOptions["transports"]> = [
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
];

if (env.NODE_ENV === "development") {
  loggerTransports.push(
    new transports.File({
      filename: `${logDir}/combined.log`,
    })
  );
}
// Initialize winston logger
export const logger = createLogger({
  level: logLevel,
  format: defaultFormat,
  transports: loggerTransports,
  rejectionHandlers:
    env.NODE_ENV === "development"
      ? [
          new transports.File({
            filename: `${logDir}/rejections.log`,
          }),
        ]
      : undefined,
  exceptionHandlers:
    env.NODE_ENV === "development"
      ? [
          new transports.File({
            filename: `${logDir}/exceptions.log`,
          }),
        ]
      : undefined,
});

export const dbLogger = createLogger({
  level: logLevel,
  format: defaultFormat,
  transports:
    env.NODE_ENV === "development"
      ? [
          new transports.File({
            filename: `${logDir}/db/dbGeneral.log`,
          }),
        ]
      : undefined,
  rejectionHandlers:
    env.NODE_ENV === "development"
      ? [
          new transports.File({
            filename: `${logDir}/db/dbRejections.log`,
          }),
        ]
      : undefined,
  exceptionHandlers:
    env.NODE_ENV === "development"
      ? [
          new transports.File({
            filename: `${logDir}/db/dbExceptions.log`,
          }),
        ]
      : undefined,
});
