import { Injectable, Logger } from "@nestjs/common";
import { CreateInvestigationPartyInput } from "../investigation_party/dto/investigation_party";
import { Investigation } from "../../investigation/investigation/dto/investigation";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { InvestigationService } from "../investigation/investigation.service";

@Injectable()
export class InvestigationPartyService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(InvestigationPartyService.name);

  async create(investigationGuid: string, inputs: CreateInvestigationPartyInput[]): Promise<Investigation> {
    // Ensure the input is clean as GQL can't enforce one of two fields being required.
    for (const input of inputs) {
      if (!input.person && !input.business) {
        throw new Error("Each party input must include either a person or a business.");
      }
    }

    // Grab the current version of the inspection to make sure that we aren't trying to do something that isn't required
    const investigation = await this.investigationService.findOne(investigationGuid);

    await this.prisma.$transaction(async (tx) => {
      for (const input of inputs) {
        try {
          // Only insert the party if there isn't another active party with the same party reference
          const partyAlreadyExists = investigation.parties.some(
            (p) => p.isActive && p.partyReference && p.partyReference === input.partyReference,
          );

          if (partyAlreadyExists) {
            throw new Error("Record already exists on Investigation.");
          }

          const investigationParty = await tx.investigation_party.create({
            data: {
              party_guid_ref: input.partyReference,
              party_type_code_ref: input.partyTypeCode,
              investigation_guid: investigationGuid,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });

          // Only add the business if it's required
          if (input.business) {
            await tx.investigation_business.create({
              data: {
                business_guid_ref: input.business.businessReference,
                investigation_party_guid: investigationParty.investigation_party_guid,
                name: input.business.name,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }

          // Only add the person if it's required
          if (input.person) {
            await tx.investigation_person.create({
              data: {
                person_guid_ref: input.person.personReference,
                investigation_party_guid: investigationParty.investigation_party_guid,
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
          this.logger.error("Error creating investigation party:", error);
          throw error;
        }
      }
    });

    return await this.investigationService.findOne(investigationGuid);
  }

  async remove(investigationGuid: string, partyIdentifier: string): Promise<Investigation> {
    await this.prisma.$transaction(async (tx) => {
      try {
        const investigationParty = await tx.investigation_party.findFirst({
          where: {
            investigation_party_guid: partyIdentifier,
            investigation_guid: investigationGuid,
          },
        });

        if (!investigationParty) {
          throw new Error("Party not found for this investigation.");
        }

        await tx.investigation_party.update({
          where: {
            investigation_party_guid: partyIdentifier,
          },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      } catch (error) {
        this.logger.error("Error removing investigation party:", error);
        throw error;
      }
    });

    return await this.investigationService.findOne(investigationGuid);
  }
}
