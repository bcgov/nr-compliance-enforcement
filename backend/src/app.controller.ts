import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './enum/role.enum';
import { JwtRoleGuard } from './auth/jwtrole.guard';

@Controller()
@ApiTags('Health Check')
@UseGuards(JwtRoleGuard)
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

  @Get()
  @Public()
  @Roles(Role.COS_OFFICER)
  getHelloAuth(): string {
    return this.appService.getHello();
  }
}
