import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import * as dotenv from "dotenv";
import * as express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { connect, JSONCodec, RetentionPolicy, StorageType } from "nats";

async function bootstrap() {
  dotenv.config();
  const server = express();
  server.disable("x-powered-by");
  server.get("/health", (req, res) => res.status(200).send("ok"));
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.listen(3002);

  const nc = await connect({ servers: process.env.NATS_HOST });
  const jsm = await nc.jetstreamManager();

  try {
    // Create or update a stream with deduplication window
    const streamInfo = await jsm.streams.add({
      name: "COMPLAINTS_STREAM",
      subjects: ["new_complaints", "updated_complaints", "new_staging_complaints"],
      retention: RetentionPolicy.Workqueue,
      max_age: 86400000, // 24 hours in milliseconds
      storage: StorageType.Memory,
      duplicate_window: 120000, // 2 minutes in milliseconds
    });
    console.log("Stream configured successfully:", streamInfo);
  } catch (error) {
    console.error("Failed to configure stream:", error);
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_HOST],
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
