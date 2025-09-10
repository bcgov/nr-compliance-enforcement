import { Module } from "@nestjs/common";
import { PartyTypeCodeService } from "./party_type_code.service";
import { PartyTypeCodeResolver } from "./party_type_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [PartyTypeCodeResolver, PartyTypeCodeService],
})
export class PartyTypeCodeModule {}
