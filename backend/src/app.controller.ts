import { Controller, Get, HttpException } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./auth/decorators/public.decorator";

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
  getHelloPrivate(): string {
    return this.appService.getHello();
  }
}
