import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party_association_role_code } from "prisma/shared/generated/party_association_role_code";
import { PartyAssociationRole } from "./dto/party_association_role_code";

@Injectable()
export class PartyAssociationRoleCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(PartyAssociationRoleCodeService.name);

  async findAll() {
    const prismaPartyAssociationRoleCodes = await this.prisma.party_association_role_code.findMany({
      select: {
        party_association_role_code: true,
        case_activity_type_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<party_association_role_code, PartyAssociationRole>(
      prismaPartyAssociationRoleCodes as Array<party_association_role_code>,
      "party_association_role_code",
      "PartyAssociationRole",
    );
  }
}
