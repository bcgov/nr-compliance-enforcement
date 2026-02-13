import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { UpdateLegislationConfigurationInput } from "src/shared/legislation_configuration/dto/legislation_configuration";

@Injectable()
export class LegislationConfigurationService {
  constructor(private readonly prisma: SharedPrismaService) {}
  private readonly logger = new Logger(LegislationConfigurationService.name);

  async update(input: UpdateLegislationConfigurationInput[], updateUserId: string): Promise<boolean> {
    try {
      for (const item of input) {
        await this.prisma.legislation_configuration.updateMany({
          where: { legislation_guid: item.legislationGuid, agency_code: item.agencyCode },
          data: {
            ...(item.isEnabled !== undefined && { enabled_ind: item.isEnabled }),
            ...(item.overrideText !== undefined && { override_text: item.overrideText }),
            update_user_id: updateUserId,
            update_utc_timestamp: new Date(),
          },
        });
      }
      return true;
    } catch (error) {
      this.logger.error("Error updating legislation", error);
      return false;
    }
  }
}
