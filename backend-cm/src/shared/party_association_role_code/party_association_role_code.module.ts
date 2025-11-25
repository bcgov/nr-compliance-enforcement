import { Module } from "@nestjs/common";
import { PartyAssociationRoleCodeService } from "./party_association_role_code.service";
import { PartyAssociationRoleCodeResolver } from "./party_association_role_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [PartyAssociationRoleCodeResolver, PartyAssociationRoleCodeService],
})
export class PartyAssociationRoleCodeModule {}
