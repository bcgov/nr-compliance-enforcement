import { Module } from "@nestjs/common";
import { AppUserService } from "./app_user.service";
import { AppUserResolver } from "./app_user.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { UserModule } from "../../common/user.module";

@Module({
  imports: [PrismaModuleShared, UserModule],
  providers: [AppUserResolver, AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
