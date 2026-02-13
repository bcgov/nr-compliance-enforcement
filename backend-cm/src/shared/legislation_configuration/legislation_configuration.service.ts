import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { UpdateLegislationConfigurationInput } from "src/shared/legislation_configuration/dto/legislation_configuration";

@Injectable()
export class LegislationConfigurationService {
  constructor(private readonly prisma: SharedPrismaService) {}

  async update(input: UpdateLegislationConfigurationInput, updateUserId: string): Promise<boolean> {
    await this.prisma.legislation_configuration.updateMany({
      where: { legislation_guid: input.legislationGuid, agency_code: input.agencyCode },
      data: {
        ...(input.isEnabled !== undefined && { enabled_ind: input.isEnabled }),
        ...(input.overrideText !== undefined && { override_text: input.overrideText }),
        update_user_id: updateUserId,
        update_utc_timestamp: new Date(),
      },
    });
    return true;
  }
}
