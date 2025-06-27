import { NestExpressApplication } from "@nestjs/platform-express";
import { bootstrap } from "./app";
import { Logger } from "@nestjs/common";
import dotenv from "dotenv";

const logger = new Logger("NestApplication");
dotenv.config();
bootstrap()
  .then(async (app: NestExpressApplication) => {
    const port = process.env.BACKEND_PORT ? Number(process.env.BACKEND_PORT) : 3000;
    await app.listen(port);
    logger.log(`Listening on ${await app.getUrl()}`);
  })
  .catch((err) => {
    logger.error(err);
  });
