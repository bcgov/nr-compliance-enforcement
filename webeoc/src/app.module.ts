import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ComplaintsPublisherService } from "./publishers/complaints-publisher.service";
import { WebEocScheduler } from "./webeoc-scheduler/webeoc-scheduler.service";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ComplaintsSubscriberService } from "./subscribers/complaints-subscriber.service";
import { StagingComplaintsApiService } from "./staging-complaints-api-service/staging-complaints-api-service.service";
import { ActionsTakenPublisherService } from "./publishers/actions-taken-publisher.service";
import { ActionsTakenSubscriberService } from "./subscribers/actions-taken-subscriber.service";
import { ComplaintApiService } from "./complaint-api-service/complaint-api.service";

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    ComplaintsPublisherService,
    WebEocScheduler,
    ComplaintsSubscriberService,
    StagingComplaintsApiService,
    ActionsTakenPublisherService,
    ActionsTakenSubscriberService,
    ComplaintApiService,
  ],
})
export class AppModule {}
