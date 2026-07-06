import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";
import { InvestigationPartyService } from "../investigation_party/investigation_party_service";
import { InvestigationPartyResolver } from "../investigation_party/investigation_party.resolver";
import { InvestigationModule } from "../investigation/investigation.module";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";

@Module({
  imports: [PrismaModuleInvestigation, UserModule, InvestigationModule],
  providers: [InvestigationPartyResolver, InvestigationPartyService, SharedPrismaService],
})
export class InvestigationPartyModule {}
