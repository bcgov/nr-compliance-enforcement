import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party_type_code } from "prisma/shared/generated/party_type_code";
import { PartyTypeCode } from "./dto/party_type_code";

@Injectable()
export class PartyTypeCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(PartyTypeCodeService.name);

  async findAll() {
    const prismaPartyTypeCodes = await this.prisma.party_type_code.findMany({
      select: {
        party_type_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<party_type_code, PartyTypeCode>(
      prismaPartyTypeCodes as Array<party_type_code>,
      "party_type_code",
      "PartyTypeCode",
    );
  }
}
