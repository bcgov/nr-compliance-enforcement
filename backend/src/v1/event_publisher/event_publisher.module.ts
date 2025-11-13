import { Module } from "@nestjs/common";
import { EventPublisherService } from "./event_publisher.service";
import { FeatureFlagModule } from "../feature_flag/feature_flag.module";

@Module({
  imports: [FeatureFlagModule],
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class EventPublisherModule {}
