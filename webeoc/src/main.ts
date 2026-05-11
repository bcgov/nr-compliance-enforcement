import { NestFactory } from "@nestjs/core";
import { ConsoleLogger, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";

async function bootstrap() {
  process.env.TZ = "UTC"; // this application runs on UTC time in OpenShift, so let's do the same locally as well.  Useful to test polling periods.
  const logger = new Logger("Bootstrap");
  logger.log("Starting WebEOC Connection Container");
  dotenv.config();
  const server = express();
  server.disable("x-powered-by");
  server.get("/health", (req, res) => res.status(200).send("ok"));
  server.listen(3002);
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: new ConsoleLogger({ json: process.env.LOG_FORMAT === "json" }),
  });
  await app.listen(3002);
}

bootstrap();
