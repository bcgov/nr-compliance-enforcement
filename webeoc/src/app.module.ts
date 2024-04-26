import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ComplaintsPublisherService } from "./complaints-publisher/complaints-publisher.service";
import { WebEOCComplaintsScheduler } from "./webeoc-complaints-scheduler/webeoc-complaints-scheduler.service";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { ComplaintsSubscriberService } from "./complaints-subscriber/complaints-subscriber.service";
import { StagingComplaintsApiService } from "./staging-complaints-api-service/staging-complaints-api-service.service";

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    ComplaintsPublisherService,
    WebEOCComplaintsScheduler,
    ComplaintsSubscriberService,
    StagingComplaintsApiService,
  ],
})
export class AppModule {}
