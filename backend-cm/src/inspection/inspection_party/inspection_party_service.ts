import { Injectable, Logger } from "@nestjs/common";
import { CreateInspectionPartyInput } from "../inspection_party/dto/inspection_party";
import { Inspection } from "../../inspection/inspection/dto/inspection";
import { InspectionPrismaService } from "../../prisma/inspection/prisma.inspection.service";
import { UserService } from "../../common/user.service";
import { InspectionService } from "../inspection/inspection.service";

@Injectable()
export class InspectionPartyService {
  constructor(
    private readonly prisma: InspectionPrismaService,
    private readonly user: UserService,
    private readonly inspectionService: InspectionService,
  ) {}

  private readonly logger = new Logger(InspectionPartyService.name);

  async create(inspectionGuid: string, inputs: CreateInspectionPartyInput[]): Promise<Inspection> {
    // Ensure the input is clean as GQL can't enforce one of two fields being required.
    for (const input of inputs) {
      if (!input.person && !input.business) {
        throw new Error("Each party input must include either a person or a business.");
      }
    }

    // Grab the current version of the inspection to make sure that we aren't trying to do something that isn't required
    const inspection = await this.inspectionService.findOne(inspectionGuid);

    await this.prisma.$transaction(async (tx) => {
      for (const input of inputs) {
        try {
          // Only insert the party if there isn't another active party with the same party reference
          const partyAlreadyExists = inspection.parties.some(
            (p) => p.isActive && p.partyReference && p.partyReference === input.partyReference,
          );

          if (partyAlreadyExists) {
            throw new Error("Record already exists on Inspection.");
          }

          const inspectionParty = await tx.inspection_party.create({
            data: {
              party_guid_ref: input.partyReference,
              party_type_code_ref: input.partyTypeCode,
              inspection_guid: inspectionGuid,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });

          // Only add the business if it's required
          if (input.business) {
            await tx.inspection_business.create({
              data: {
                business_guid_ref: input.business.businessReference,
                inspection_party_guid: inspectionParty.inspection_party_guid,
                name: input.business.name,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }

          // Only add the person if it's required
          if (input.person) {
            await tx.inspection_person.create({
              data: {
                person_guid_ref: input.person.personReference,
                inspection_party_guid: inspectionParty.inspection_party_guid,
                first_name: input.person.firstName,
                middle_name: input.person.middleName,
                middle_name_2: input.person.middleName2,
                last_name: input.person.lastName,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }
        } catch (error) {
          this.logger.error("Error creating inspection party:", error);
          throw error;
        }
      }
    });

    return await this.inspectionService.findOne(inspectionGuid);
  }

  async remove(inspectionGuid: string, partyIdentifier: string): Promise<Inspection> {
    await this.prisma.$transaction(async (tx) => {
      try {
        const inspectionParty = await tx.inspection_party.findFirst({
          where: {
            inspection_party_guid: partyIdentifier,
            inspection_guid: inspectionGuid,
          },
        });

        if (!inspectionParty) {
          throw new Error("Party not found for this inspection.");
        }

        await tx.inspection_party.update({
          where: {
            inspection_party_guid: partyIdentifier,
          },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      } catch (error) {
        this.logger.error("Error removing inspection party:", error);
        throw error;
      }
    });

    return await this.inspectionService.findOne(inspectionGuid);
  }
}
