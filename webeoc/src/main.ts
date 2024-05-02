import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";

async function bootstrap() {
  console.log("Starting WebEOC Connection Container");
  dotenv.config();
  const server = express();
  server.disable("x-powered-by");
  server.get("/health", (req, res) => res.status(200).send("ok"));
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.listen(3002);
}

bootstrap();
