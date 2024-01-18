import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();

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
bootstrap();
