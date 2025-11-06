import { Module } from "@nestjs/common";
import { AppUserTeamXrefService } from "./app_user_team_xref.service";
import { AppUserTeamXrefResolver } from "./app_user_team_xref.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { UserModule } from "../../common/user.module";

@Module({
  imports: [PrismaModuleShared, UserModule],
  providers: [AppUserTeamXrefService, AppUserTeamXrefResolver],
  exports: [AppUserTeamXrefService],
})
export class AppUserTeamXrefModule {}
