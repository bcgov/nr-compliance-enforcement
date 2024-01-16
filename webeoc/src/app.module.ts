import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComplaintsService } from './complaints/complaints.service';
import { ScheduledTaskService } from './scheduled-task/scheduled-task.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ComplaintsSubscriberService } from './complaints-subscriber/complaints-subscriber.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    ComplaintsService,
    ScheduledTaskService,
    ComplaintsSubscriberService,
  ],
})
export class AppModule {}
