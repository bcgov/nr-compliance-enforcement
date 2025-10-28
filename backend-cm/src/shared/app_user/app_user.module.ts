import { Module } from "@nestjs/common";
import { AppUserService } from "./app_user.service";
import { AppUserResolver } from "./app_user.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [AppUserResolver, AppUserService],
})
export class AppUserModule {}
