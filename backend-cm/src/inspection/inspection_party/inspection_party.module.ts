import { Module } from "@nestjs/common";
import { PrismaModuleInspection } from "../../prisma/inspection/prisma.inspection.module";
import { UserModule } from "../../common/user.module";
import { InspectionPartyService } from "../inspection_party/inspection_party_service";
import { InspectionPartyResolver } from "../inspection_party/inspection_party.resolver";
import { InspectionModule } from "../inspection/inspection.module";
import { PartyModule } from "../../shared/party/party.module";

@Module({
  imports: [PrismaModuleInspection, UserModule, InspectionModule, PartyModule],
  providers: [InspectionPartyResolver, InspectionPartyService],
})
export class InspectionPartyModule {}
