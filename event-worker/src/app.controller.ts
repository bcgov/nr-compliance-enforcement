import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { AppService } from "./app.service";
import { EventProcessorService } from "./event-processor/event-processor.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventProcessorService: EventProcessorService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  async health(): Promise<string> {
    try {
      await this.eventProcessorService.pingNats();
      return "ok";
    } catch {
      throw new ServiceUnavailableException("nats_unavailable");
    }
  }
}
