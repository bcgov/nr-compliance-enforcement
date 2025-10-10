import { Module } from "@nestjs/common";
import { PrismaModuleInvestigation } from "../../prisma/investigation/prisma.investigation.module";
import { UserModule } from "../../common/user.module";
import { InvestigationPartyService } from "../investigation_party/investigation_party_service";
import { InvestigationPartyResolver } from "../investigation_party/investigation_party.resolver";
import { InvestigationModule } from "../investigation/investigation.module";

@Module({
  imports: [PrismaModuleInvestigation, UserModule, InvestigationModule],
  providers: [InvestigationPartyResolver, InvestigationPartyService],
})
export class InvestigationPartyModule {}
