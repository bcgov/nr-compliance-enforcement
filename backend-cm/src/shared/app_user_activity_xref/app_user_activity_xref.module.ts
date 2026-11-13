import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { UserModule } from "../../common/user.module";
import { AppUserActivityXrefService } from "./app_user_activity_xref.service";

@Module({
  imports: [PrismaModuleShared, UserModule],
  providers: [AppUserActivityXrefService],
  exports: [AppUserActivityXrefService],
})
export class AppUserActivityXrefModule {}
