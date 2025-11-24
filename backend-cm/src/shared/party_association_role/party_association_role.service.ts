import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party_association_role } from "prisma/shared/generated/party_association_role";
import { PartyAssociationRole } from "./dto/party_association_role";

@Injectable()
export class PartyAssociationRoleService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(PartyAssociationRoleService.name);

  async findAll() {
    const prismaPartyTypeCodes = await this.prisma.party_association_role.findMany({
      select: {
        party_association_role: true,
        case_activity_type_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<party_association_role, PartyAssociationRole>(
      prismaPartyTypeCodes as Array<party_association_role>,
      "party_association_role",
      "PartyAssociationRole",
    );
  }
}
