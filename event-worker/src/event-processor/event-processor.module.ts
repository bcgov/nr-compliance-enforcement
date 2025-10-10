import { Module } from "@nestjs/common";
import { EventProcessorService } from "./event-processor.service";

@Module({
  providers: [EventProcessorService],
  exports: [EventProcessorService],
})
export class EventProcessorModule {}
