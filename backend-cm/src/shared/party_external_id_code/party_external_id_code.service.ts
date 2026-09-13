import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party_external_id_code } from "prisma/shared/generated/party_external_id_code";
import { PartyExternalIdCode } from "./dto/party_external_id_code";

@Injectable()
export class PartyExternalIdCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(PartyExternalIdCodeService.name);

  async findAll() {
    const prismaPartyExternalIdCodes = await this.prisma.party_external_id_code.findMany({
      select: {
        party_external_id_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<party_external_id_code, PartyExternalIdCode>(
      prismaPartyExternalIdCodes as Array<party_external_id_code>,
      "party_external_id_code",
      "PartyExternalIdCode",
    );
  }
}
