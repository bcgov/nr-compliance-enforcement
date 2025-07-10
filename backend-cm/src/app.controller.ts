import { Controller, Get, HttpException } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./auth/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags("Health Check")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  async getDBHealthCheck(): Promise<string> {
    const result = await this.appService.getDBHealthCheck();
    if (result === "Success") {
      return Promise.resolve(result);
    } else throw new HttpException("Unable to connect to database", 503);
  }
  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
