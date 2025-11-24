import { Module } from "@nestjs/common";
import { PartyAssociationRoleService } from "./party_association_role.service";
import { PartyAssociationRoleResolver } from "./party_association_role.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [PartyAssociationRoleResolver, PartyAssociationRoleService],
})
export class PartyAssociationRoleModule {}
