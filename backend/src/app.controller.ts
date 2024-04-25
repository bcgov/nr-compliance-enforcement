import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./auth/decorators/public.decorator";

@Controller()
@ApiTags("Health Check")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getHelloPrivate(): string {
    return this.appService.getHello();
  }
}
