import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party } from "../../../prisma/shared/generated/party";
import { Party, PartyCreateInput, PartyUpdateInput } from "./dto/party";
import { UserService } from "../../common/user.service";

@Injectable()
export class PartyService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(PartyService.name);

  async findOne(id: string) {
    const prismaParty = await this.prisma.party.findUnique({
      where: {
        party_guid: id,
      },
      select: {
        party_guid: true,
        party_type: true,
        create_utc_timestamp: true,
        party_type_code: {
          select: {
            party_type_code: true,
            short_description: true,
            long_description: true,
          },
        },
        business: {
          select: {
            business_guid: true,
            name: true,
          },
        },
        person: {
          select: {
            person_guid: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error mapping party of interest", error);
    }
  }

  async create(input: PartyCreateInput): Promise<Party> {
    const prismaParty = await this.prisma.party.create({
      data: {
        party_type: input.partyTypeCode,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        // Conditionally insert data into person or business table
        ...(input.partyTypeCode === "PRS"
          ? {
              person: {
                create: {
                  first_name: input.person?.firstName,
                  last_name: input.person?.lastName,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                },
              },
            }
          : {
              business: {
                create: {
                  name: input.business?.name,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                },
              },
            }),
      },
      include: {
        party_type_code: true,
        person: true,
        business: true,
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error creating party:", error);
      throw error;
    }
  }

  async update(partyIdentifier: string, input: PartyUpdateInput): Promise<Party> {
    const existingParty = await this.prisma.party.findUnique({
      where: { party_guid: partyIdentifier },
    });
    if (!existingParty) throw new Error("Party not found");

    const prismaParty = await this.prisma.party.update({
      where: { party_guid: partyIdentifier },
      data: {
        party_type: input.partyTypeCode,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
        // Conditionally update data in person or business table
        ...(input.partyTypeCode === "PRS"
          ? {
              person: {
                update: {
                  first_name: input.person?.firstName,
                  last_name: input.person?.lastName,
                  update_user_id: this.user.getIdirUsername(),
                  update_utc_timestamp: new Date(),
                },
              },
            }
          : {
              business: {
                update: {
                  name: input.business?.name,
                  update_user_id: this.user.getIdirUsername(),
                  update_utc_timestamp: new Date(),
                },
              },
            }),
      },
      include: {
        party_type_code: true,
        person: true,
        business: true,
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error updating party:", error);
      throw error;
    }
  }
}
