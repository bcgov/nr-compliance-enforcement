import { Injectable, Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { InvestigationPrismaService } from "src/prisma/investigation/prisma.investigation.service";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { UpdateLegislationConfigurationInput } from "src/shared/legislation_configuration/dto/legislation_configuration";

@Injectable()
export class LegislationConfigurationService {
  constructor(
    private readonly prisma: SharedPrismaService,
    private readonly investigationPrisma: InvestigationPrismaService,
  ) {}
  private readonly logger = new Logger(LegislationConfigurationService.name);

  async update(input: UpdateLegislationConfigurationInput[], updateUserId: string): Promise<boolean> {
    const itemsBeingDisabled = input.filter((item) => item.isEnabled === false).map((item) => item.legislationGuid);
    const referenced = await this.countReferencingContraventions(itemsBeingDisabled);
    if (referenced > 0) {
      throw new GraphQLError("Sections referenced by recorded contraventions cannot be disabled.", {});
    }

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

  // These guids can't be disabled as they are referenced directly, by a contravention, or by a descendant
  async findReferencedLegislationGuids(legislationGuids: string[]): Promise<string[]> {
    if (legislationGuids.length === 0) {
      return [];
    }

    const contraventions = await this.investigationPrisma.$queryRaw<{ legislation_guid_ref: string }[]>`
      SELECT DISTINCT legislation_guid_ref
      FROM contravention
      WHERE legislation_guid_ref IS NOT NULL
    `;
    const referencedGuids = contraventions.map((row) => row.legislation_guid_ref);

    const referenced = await this.prisma.$queryRaw<{ legislation_guid: string }[]>`
      WITH RECURSIVE ancestors AS (
        SELECT l.legislation_guid, l.parent_legislation_guid
        FROM legislation l
        WHERE l.legislation_guid = ANY(${referencedGuids}::uuid[])
        UNION
        SELECT p.legislation_guid, p.parent_legislation_guid
        FROM legislation p
        INNER JOIN ancestors a ON p.legislation_guid = a.parent_legislation_guid
      )
      SELECT DISTINCT legislation_guid
      FROM ancestors
      WHERE legislation_guid = ANY(${legislationGuids}::uuid[])
    `;

    return referenced.map((row) => row.legislation_guid);
  }

  private async countReferencingContraventions(legislationGuids: string[]): Promise<number> {
    if (legislationGuids.length === 0) {
      return 0;
    }

    const descendants = await this.prisma.$queryRaw<{ legislation_guid: string }[]>`
      WITH RECURSIVE descendants AS (
        SELECT l.legislation_guid
        FROM legislation l
        WHERE l.legislation_guid = ANY(${legislationGuids}::uuid[])
        UNION
        SELECT c.legislation_guid
        FROM legislation c
        INNER JOIN descendants d ON c.parent_legislation_guid = d.legislation_guid
      )
      SELECT legislation_guid FROM descendants
    `;
    const descendantGuids = descendants.map((row) => row.legislation_guid);

    // Soft-deleted contraventions still count as references
    const [{ count }] = await this.investigationPrisma.$queryRaw<{ count: number }[]>`
      SELECT count(*)::int AS count
      FROM contravention
      WHERE legislation_guid_ref = ANY(${descendantGuids}::uuid[])
    `;

    return count;
  }
}
