import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { connect, JetStreamManager } from 'nats';
import { ExpressAdapter } from '@nestjs/platform-express';
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from './common/constants';

async function initializeJetStream() {
  const nc = await connect({
    servers: [process.env.NATS_HOST],
  });

  // Access the JetStream Management (JSM) interface
  const jsm: JetStreamManager = await nc.jetstreamManager();

  // Define your stream and subjects
  const streamName = 'WEBEOC';
  const subjects = [
    NATS_NEW_COMPLAINTS_TOPIC_NAME,
    NEW_STAGING_COMPLAINTS_TOPIC_NAME,
  ]; // List of subjects

  try {
    // Check if the stream already exists
    await jsm.streams.info(streamName);
    console.log(`Stream '${streamName}' already exists.`);
  } catch (error) {
    // If the stream does not exist, create it
    console.log(
      `Creating stream '${streamName}' for subjects: ${subjects.join(', ')}`,
    );
    await jsm.streams.add({
      name: streamName,
      subjects: subjects,
    });
  }
}

async function bootstrap() {
  dotenv.config();
  await initializeJetStream(); // Ensure JetStream is initialized before starting the app

  // Create an Express instance
  const server = express();
  server.disable('x-powered-by');
  server.get('/health', (req, res) => res.status(200).send('ok'));

  // Create a Nest application with the Express instance
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Start the HTTP server on a different port for health checks
  await app.listen(3002);

  // Create and start the microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_HOST],
    },
  });

  await app.startAllMicroservices();
}

bootstrap().catch(console.error);
