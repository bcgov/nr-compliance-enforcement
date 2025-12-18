import { Module } from "@nestjs/common";
import { DiaryDateService } from "./diary_date.service";
import { DiaryDateResolver } from "./diary_date.resolver";
import { PrismaModuleInvestigation } from "src/prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "src/common/user.module";

@Module({
  imports: [PrismaModuleInvestigation, PrismaModuleShared, AutomapperModule, UserModule],
  providers: [DiaryDateResolver, DiaryDateService],
  exports: [DiaryDateService],
})
export class DiaryDateModule {}
