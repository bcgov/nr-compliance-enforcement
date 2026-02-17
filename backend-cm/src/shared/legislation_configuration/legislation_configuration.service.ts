import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { UpdateLegislationConfigurationInput } from "src/shared/legislation_configuration/dto/legislation_configuration";

@Injectable()
export class LegislationConfigurationService {
  constructor(private readonly prisma: SharedPrismaService) {}
  private readonly logger = new Logger(LegislationConfigurationService.name);

  async update(input: UpdateLegislationConfigurationInput[], updateUserId: string): Promise<boolean> {
    try {
      const BATCH_SIZE = 500;

      // Use Raw SQL for MAXIMUM POWER! (toggling entire act took 45 seconds with Prisma, < 1 second with Raw SQL)
      for (let i = 0; i < input.length; i += BATCH_SIZE) {
        const batch = input.slice(i, i + BATCH_SIZE);

        // Build CASE statements for conditional updates
        const enabledCases = batch
          .map(
            (item) =>
              `WHEN legislation_guid = '${item.legislationGuid}' AND agency_code = '${item.agencyCode}' THEN ${item.isEnabled}`,
          )
          .join(" ");

        const conditions = batch
          .map((item) => `(legislation_guid = '${item.legislationGuid}' AND agency_code = '${item.agencyCode}')`)
          .join(" OR ");

        await this.prisma.$executeRawUnsafe(`
        UPDATE legislation_configuration
        SET 
          enabled_ind = CASE ${enabledCases} ELSE enabled_ind END,
          update_user_id = '${updateUserId}',
          update_utc_timestamp = NOW()
        WHERE ${conditions}
      `);
      }

      return true;
    } catch (error) {
      this.logger.error("Error updating legislation", error);
      return false;
    }
  }
}
