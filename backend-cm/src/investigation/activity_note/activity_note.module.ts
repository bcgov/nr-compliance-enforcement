import { Module } from "@nestjs/common";
import { ActivityNoteService } from "./activity_note.service";
import { ActivityNoteResolver } from "./activity_note.resolver";
import { PrismaModuleInvestigation } from "src/prisma/investigation/prisma.investigation.module";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "src/common/user.module";
import { InvestigationModule } from "src/investigation/investigation/investigation.module";

@Module({
  imports: [PrismaModuleInvestigation, PrismaModuleShared, InvestigationModule, AutomapperModule, UserModule],
  providers: [ActivityNoteResolver, ActivityNoteService],
  exports: [ActivityNoteService],
})
export class ActivityNoteModule {}
