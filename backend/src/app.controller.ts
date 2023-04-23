import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CedsAuthGuard } from './auth/ceds.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(CedsAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
