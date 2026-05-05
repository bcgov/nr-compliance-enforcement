import { WinstonModule, utilities } from "nest-winston";
import * as winston from "winston";
import { Logger, LoggerService } from "@nestjs/common";

export const logger = new Logger("BackendCM");

const timestampFormat: winston.Logform.Format = winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS" });

const prettyFormat: winston.Logform.Format = winston.format.combine(
  timestampFormat,
  winston.format.colorize(),
  winston.format.align(),
  utilities.format.nestLike("BackendCM", { prettyPrint: true }),
);

const jsonFormat: winston.Logform.Format = winston.format.combine(
  timestampFormat,
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const resolveFormat = (): winston.Logform.Format => {
  return process.env.LOG_FORMAT === "json" ? jsonFormat : prettyFormat;
};

export const customLogger: LoggerService = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: "silly",
      format: resolveFormat(),
    }),
  ],
  exitOnError: false,
});
