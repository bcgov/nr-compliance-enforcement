import { Module } from "@nestjs/common";
import { EventPublisherService } from "./event_publisher.service";

@Module({
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class EventPublisherModule {}
