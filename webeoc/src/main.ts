import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ScheduledTaskService } from './scheduled-task/scheduled-task.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
      },
    },
  );

  // Manually trigger the complaints processing
  const tasksService = app.get(ScheduledTaskService);
  tasksService.handleCron();

  await app.listen();
}
bootstrap();
