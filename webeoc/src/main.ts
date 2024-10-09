import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";

async function bootstrap() {
  process.env.TZ = "UTC"; // this application runs on UTC time in OpenShift, so let's do the same locally as well.  Useful to test polling periods.
  console.log("Starting WebEOC Connection Container");
  dotenv.config();
  const server = express();
  server.disable("x-powered-by");
  server.get("/health", (req, res) => res.status(200).send("ok"));
  server.listen(3002);
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.listen(3002);
}

bootstrap();
