import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwtauth.guard';
import { JwtAuthStrategy } from './jwtauth.strategy';import { Roles } from './decorators/roles.decorator';
import { JwtRoleGuard } from './jwtrole.guard';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtAuthStrategy,{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },{
    provide: APP_GUARD,
    useClass: JwtRoleGuard,
  },],
  exports: [PassportModule],
})
export class JwtAuthModule {}