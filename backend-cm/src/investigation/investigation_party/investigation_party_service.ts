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
    for (const input of inputs) {
      if (!input.person && !input.business) {
        throw new Error("Each party input must include either a person or a business.");
      }
    }

    await this.prisma.$transaction(async (tx) => {
      for (const input of inputs) {
        try {
          const investigationParty = await tx.investigation_party.create({
            data: {
              party_guid_ref: input.partyReference,
              party_type_code_ref: input.partyTypeCode,
              investigation_guid: investigationGuid,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });

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
          } else if (input.person) {
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
}
