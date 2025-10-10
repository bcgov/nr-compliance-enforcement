import { Module } from "@nestjs/common";
import { EventPublisherService } from "./event-publisher.service";

@Module({
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class EventPublisherModule {}
