import { Module } from "@nestjs/common";
import { CaseActivityResolver } from "./case_activity.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "../../common/user.module";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";

@Module({
  imports: [PrismaModuleShared, AutomapperModule, UserModule],
  providers: [CaseActivityResolver, CaseActivityService],
})
export class CaseActivityModule {}
