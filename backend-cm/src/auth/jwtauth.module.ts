import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwtauth.guard";
import { JwtAuthStrategy } from "./jwtauth.strategy";
@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [
    JwtAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [PassportModule],
})
export class JwtAuthModule {}
