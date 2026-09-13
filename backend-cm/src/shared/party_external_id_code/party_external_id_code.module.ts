import { Module } from "@nestjs/common";
import { PartyExternalIdCodeService } from "./party_external_id_code.service";
import { PartyExternalIdCodeResolver } from "./party_external_id_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [PartyExternalIdCodeResolver, PartyExternalIdCodeService],
})
export class PartyExternalIdCodeModule {}
