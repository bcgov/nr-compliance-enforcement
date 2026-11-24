import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { JwtOrApiKeyGuard } from "./jwt-or-apikey.guard";
import { JwtAuthStrategy } from "./jwtauth.strategy";
import { PrismaModuleShared } from "../prisma/shared/prisma.shared.module";
@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), PrismaModuleShared],
  providers: [
    JwtAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtOrApiKeyGuard,
    },
  ],
  exports: [PassportModule],
})
export class JwtAuthModule {}
