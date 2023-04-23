import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './jwtauth.strategy';@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtAuthStrategy],
  exports: [PassportModule],
})
export class JwtAuthModule {}