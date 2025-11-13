import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventProcessorModule } from "./event-processor/event-processor.module";

@Module({
  imports: [EventProcessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
