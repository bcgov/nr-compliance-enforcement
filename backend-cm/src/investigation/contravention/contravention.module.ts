import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";
import { InvestigationModule } from "../investigation/investigation.module";
import { ContraventionResolver } from "src/investigation/contravention/contravention.resolver";
import { ContraventionService } from "src/investigation/contravention/contravention.service";

@Module({
  imports: [PrismaModuleInvestigation, UserModule, InvestigationModule],
  providers: [ContraventionResolver, ContraventionService],
})
export class ContraventionModule {}
