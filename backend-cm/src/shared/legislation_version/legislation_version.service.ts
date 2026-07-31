import { Injectable, Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Prisma, legislation_source, legislation_version } from ".prisma/shared"; // NOSONAR
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { toDate, toDateString } from "../../common/custom_scalars";
import { LegislationService } from "../legislation/legislation.service";
import { LegislationSource } from "../legislation_source/dto/legislation-source";
import { ImportStatus, ImportableLegislationVersion, LegislationVersion } from "./dto/legislation-version";

const NON_SUCCESS_STATUSES: ImportStatus[] = ["PENDING", "FAILED"];

interface ContraventionStats {
  count: number;
  earliest: string | null;
  latest: string | null;
}

@Injectable()
export class LegislationVersionService {
  constructor(
    private readonly prisma: SharedPrismaService,
    private readonly investigationPrisma: InvestigationPrismaService,
    private readonly legislationService: LegislationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(LegislationVersionService.name);

  async getById(legislationVersionGuid: string): Promise<LegislationVersion | null> {
    const version = await this.prisma.legislation_version.findUnique({
      where: { legislation_version_guid: legislationVersionGuid },
    });

    return version
      ? this.mapper.map<legislation_version, LegislationVersion>(version, "legislation_version", "LegislationVersion")
      : null;
  }

  async getBySource(legislationSourceGuid: string): Promise<LegislationVersion[]> {
    const versions = await this.prisma.legislation_version.findMany({
      where: { legislation_source_guid: legislationSourceGuid },
      orderBy: { effective_date: "desc" },
    });

    return this.mapper.mapArray<legislation_version, LegislationVersion>(
      versions,
      "legislation_version",
      "LegislationVersion",
    );
  }

  async getNewestValidVersion(
    legislationSourceGuid: string,
    client: Prisma.TransactionClient = this.prisma,
  ): Promise<LegislationVersion | null> {
    const version = await client.legislation_version.findFirst({
      where: { legislation_source_guid: legislationSourceGuid, import_status: "SUCCESS" },
      orderBy: { effective_date: "desc" },
    });

    return version
      ? this.mapper.map<legislation_version, LegislationVersion>(version, "legislation_version", "LegislationVersion")
      : null;
  }

  async getActAndRegulationVersionGuids(actVersionGuid: string): Promise<string[]> {
    const children = await this.prisma.legislation_version.findMany({
      where: { parent_legislation_version_guid: actVersionGuid },
      select: { legislation_version_guid: true },
    });

    return [actVersionGuid, ...children.map((child) => child.legislation_version_guid)];
  }

  async getPreviousRegulationSources(actVersionGuid: string): Promise<LegislationSource[]> {
    const version = await this.getById(actVersionGuid);

    if (!version) {
      throw new GraphQLError("Legislation version not found", {});
    }

    const previousVersion = await this.getPreviousValidVersion(version);

    if (!previousVersion) {
      return [];
    }

    const children = await this.prisma.legislation_version.findMany({
      where: { parent_legislation_version_guid: previousVersion.legislationVersionGuid },
      include: { legislation_source: true },
    });

    return children.map((child) =>
      this.mapper.map<legislation_source, LegislationSource>(
        child.legislation_source,
        "legislation_source",
        "LegislationSource",
      ),
    );
  }

  async create(
    legislationSourceGuid: string,
    effectiveDate: string,
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<LegislationVersion> {
    const client = tx ?? this.prisma;

    const source = await client.legislation_source.findUnique({
      where: { legislation_source_guid: legislationSourceGuid },
    });

    if (!source) {
      throw new GraphQLError("Legislation source not found", {});
    }

    const outstanding = await client.legislation_version.findFirst({
      where: { legislation_source_guid: legislationSourceGuid, import_status: { in: NON_SUCCESS_STATUSES } },
    });

    if (outstanding) {
      throw new GraphQLError(
        "This source already has a version pending import. Import or delete it before creating another.",
        {},
      );
    }

    const newestVersion = await this.getNewestValidVersion(legislationSourceGuid, client);
    await this.validateEffectiveDate(newestVersion, effectiveDate);

    const version = await client.legislation_version.create({
      data: {
        legislation_source_guid: legislationSourceGuid,
        effective_date: toDate(effectiveDate),
        import_status: "PENDING",
        create_user_id: userId,
        create_utc_timestamp: new Date(),
      },
    });

    return this.mapper.map<legislation_version, LegislationVersion>(
      version,
      "legislation_version",
      "LegislationVersion",
    );
  }

  // Today only the import of an act writes regulation versions. The parent link exists so regulations can later
  // be versioned independently under an act, with their own effective dates inside the parents window
  async upsertRegulationVersion(actVersionGuid: string, legislationSourceGuid: string): Promise<LegislationVersion> {
    const actVersion = await this.getById(actVersionGuid);

    if (!actVersion) {
      throw new GraphQLError("Legislation version not found", {});
    }

    const existing = await this.prisma.legislation_version.findFirst({
      where: { parent_legislation_version_guid: actVersionGuid, legislation_source_guid: legislationSourceGuid },
    });

    // An existing regulation is being imported again, so reset to PENDING
    const version = existing
      ? await this.prisma.legislation_version.update({
          where: { legislation_version_guid: existing.legislation_version_guid },
          data: {
            import_status: "PENDING",
            update_user_id: "system",
            update_utc_timestamp: new Date(),
          },
        })
      : await this.prisma.legislation_version.create({
          data: {
            legislation_source_guid: legislationSourceGuid,
            parent_legislation_version_guid: actVersionGuid,
            effective_date: toDate(actVersion.effectiveDate),
            import_status: "PENDING",
            create_user_id: "system",
            create_utc_timestamp: new Date(),
          },
        });

    return this.mapper.map<legislation_version, LegislationVersion>(
      version,
      "legislation_version",
      "LegislationVersion",
    );
  }

  async recordFetchedDocument(
    legislationVersionGuid: string,
    sourceUrl: string,
    sourceEffectiveDate: Date | null,
  ): Promise<void> {
    await this.prisma.legislation_version.update({
      where: { legislation_version_guid: legislationVersionGuid },
      data: {
        source_url: sourceUrl,
        source_effective_date: sourceEffectiveDate,
        update_user_id: "system",
        update_utc_timestamp: new Date(),
      },
    });
  }

  async updateEffectiveDate(
    legislationVersionGuid: string,
    newDate: string,
    userId: string,
  ): Promise<LegislationVersion> {
    const version = await this.getById(legislationVersionGuid);

    if (!version) {
      throw new GraphQLError("Legislation version not found", {});
    }

    // If there is a parentLegislationVersionGuid this is a regulation not an act
    if (version.parentLegislationVersionGuid) {
      throw new GraphQLError("Effective date can only be changed for acts.", {});
    }

    const isImported = version.importStatus === "SUCCESS";
    const previousVersion = isImported
      ? await this.getPreviousValidVersion(version)
      : await this.getNewestValidVersion(version.legislationSourceGuid);

    if (isImported) {
      const newestVersion = await this.getNewestValidVersion(version.legislationSourceGuid);
      const isNewest = newestVersion?.legislationVersionGuid === legislationVersionGuid;
      const isEarliest = !previousVersion;

      if (!isNewest && !isEarliest) {
        throw new GraphQLError("Only the newest or the earliest imported version's effective date can be changed.", {});
      }
    }

    await this.validateEffectiveDate(previousVersion, newDate);

    const stats = await this.getContraventionCountByVersion(
      await this.getActAndRegulationVersionGuids(legislationVersionGuid),
    );
    if (stats.earliest && newDate > stats.earliest) {
      throw new GraphQLError(
        `The effective date must be on or before ${stats.earliest}, the earliest contravention recorded under this version.`,
        {},
      );
    }

    const nextVersion = await this.getNextValidVersion(version);
    if (nextVersion && newDate >= nextVersion.effectiveDate) {
      throw new GraphQLError(
        `The effective date must be before ${nextVersion.effectiveDate}, the next version's effective date.`,
        {},
      );
    }

    const timestamp = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.legislation_version.update({
        where: { legislation_version_guid: legislationVersionGuid },
        data: {
          effective_date: toDate(newDate),
          update_user_id: userId,
          update_utc_timestamp: timestamp,
        },
      });

      await tx.legislation_version.updateMany({
        where: { parent_legislation_version_guid: legislationVersionGuid },
        data: {
          effective_date: toDate(newDate),
          update_user_id: userId,
          update_utc_timestamp: timestamp,
        },
      });

      return row;
    });

    return this.mapper.map<legislation_version, LegislationVersion>(
      updated,
      "legislation_version",
      "LegislationVersion",
    );
  }

  async markFailed(legislationVersionGuid: string, log: string): Promise<void> {
    const timestamp = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.legislation_version.update({
        where: { legislation_version_guid: legislationVersionGuid },
        data: {
          import_status: "FAILED",
          last_import_log: log,
          last_import_timestamp: timestamp,
          update_user_id: "system",
          update_utc_timestamp: timestamp,
        },
      });

      await tx.legislation_version.updateMany({
        where: { parent_legislation_version_guid: legislationVersionGuid },
        data: {
          import_status: "FAILED",
          last_import_timestamp: timestamp,
          update_user_id: "system",
          update_utc_timestamp: timestamp,
        },
      });
    });
  }

  async markImported(actVersionGuid: string, log: string): Promise<void> {
    const version = await this.getById(actVersionGuid);

    if (!version) {
      throw new GraphQLError("Legislation version not found", {});
    }

    if (version.parentLegislationVersionGuid) {
      throw new GraphQLError("Regulation versions are imported with their act version.", {});
    }

    // Re-running the check below would find an imported version as its own previous version and fail it
    if (version.importStatus === "SUCCESS") {
      return;
    }

    const previousVersion = await this.getNewestValidVersion(version.legislationSourceGuid);

    try {
      await this.validateEffectiveDate(previousVersion, version.effectiveDate);
    } catch (error) {
      const errorLog = `${error.message}. Invalid effective date. Update the version's effective date and run the import again.`;
      this.logger.warn(`Import of legislation version ${actVersionGuid} was invalid: ${errorLog}`);
      await this.markFailed(actVersionGuid, errorLog);
      throw new GraphQLError(errorLog, {});
    }

    const timestamp = new Date();
    // Mark acts
    await this.prisma.$transaction(async (tx) => {
      await tx.legislation_version.update({
        where: { legislation_version_guid: actVersionGuid },
        data: {
          import_status: "SUCCESS",
          last_import_log: log,
          last_import_timestamp: timestamp,
          update_user_id: "system",
          update_utc_timestamp: timestamp,
        },
      });

      // Mark regulations under the act
      await tx.legislation_version.updateMany({
        where: { parent_legislation_version_guid: actVersionGuid, import_status: { not: "FAILED" } },
        data: {
          import_status: "SUCCESS",
          last_import_timestamp: timestamp,
          update_user_id: "system",
          update_utc_timestamp: timestamp,
        },
      });
    });
  }

  async getImportableVersions(sourceType: string): Promise<ImportableLegislationVersion[]> {
    const versions = await this.prisma.legislation_version.findMany({
      where: {
        import_status: { in: NON_SUCCESS_STATUSES },
        parent_legislation_version_guid: null,
        legislation_source: { active_ind: true, source_type: sourceType },
      },
      include: { legislation_source: true },
      orderBy: { effective_date: "asc" },
    });

    return versions.map((version) => ({
      ...this.mapper.map<legislation_version, LegislationVersion>(version, "legislation_version", "LegislationVersion"),
      source: this.mapper.map<legislation_source, LegislationSource>(
        version.legislation_source,
        "legislation_source",
        "LegislationSource",
      ),
    }));
  }

  async reset(legislationVersionGuid: string, userId: string): Promise<void> {
    return this.remove(legislationVersionGuid, userId, false);
  }

  async delete(legislationVersionGuid: string, userId: string): Promise<void> {
    return this.remove(legislationVersionGuid, userId, true);
  }

  private async remove(legislationVersionGuid: string, userId: string, removeVersionRows: boolean): Promise<void> {
    const version = await this.getById(legislationVersionGuid);

    if (!version) {
      throw new GraphQLError("Legislation version not found", {});
    }

    await this.validateVersionDelete(version);

    const versionGuids = await this.getActAndRegulationVersionGuids(legislationVersionGuid);

    const referencingContraventionCount = (await this.getContraventionCountByVersion(versionGuids)).count;
    if (referencingContraventionCount > 0) {
      throw new GraphQLError(
        `This version is referenced by ${referencingContraventionCount} recorded contravention(s) and cannot be removed.`,
        {},
      );
    }

    const childVersions = await this.prisma.legislation_version.findMany({
      where: { parent_legislation_version_guid: legislationVersionGuid },
      select: { legislation_source_guid: true },
    });
    const childSourceGuids = [...new Set(childVersions.map((child) => child.legislation_source_guid))];

    const timestamp = new Date();
    await this.prisma.$transaction(async (tx) => {
      await this.legislationService.deleteByVersion(versionGuids, tx);

      await tx.legislation_version.deleteMany({
        where: { parent_legislation_version_guid: legislationVersionGuid },
      });

      // If the version is being deleted, remove the row. If it is being reset, keep the row but reset fields
      if (removeVersionRows) {
        await tx.legislation_version.delete({ where: { legislation_version_guid: legislationVersionGuid } });
      } else {
        await tx.legislation_version.update({
          where: { legislation_version_guid: legislationVersionGuid },
          data: {
            import_status: "PENDING",
            source_url: null,
            source_effective_date: null,
            last_import_timestamp: null,
            last_import_log: null,
            update_user_id: userId,
            update_utc_timestamp: timestamp,
          },
        });
      }

      if (childSourceGuids.length > 0) {
        await tx.legislation_source.deleteMany({
          where: { legislation_source_guid: { in: childSourceGuids }, legislation_version: { none: {} } },
        });
      }
    });
  }

  private async validateVersionDelete(version: LegislationVersion): Promise<void> {
    if (version.parentLegislationVersionGuid) {
      throw new GraphQLError("Regulations cannot be directly deleted from under an act.", {});
    }

    if (version.importStatus === "SUCCESS") {
      const newestVersion = await this.getNewestValidVersion(version.legislationSourceGuid);
      if (newestVersion?.legislationVersionGuid !== version.legislationVersionGuid) {
        throw new GraphQLError("Only the newest imported version can be reset or deleted.", {});
      }
    }
  }

  private async getPreviousValidVersion(version: LegislationVersion): Promise<LegislationVersion | null> {
    const previous = await this.prisma.legislation_version.findFirst({
      where: {
        legislation_source_guid: version.legislationSourceGuid,
        import_status: "SUCCESS",
        legislation_version_guid: { not: version.legislationVersionGuid },
        effective_date: { lt: toDate(version.effectiveDate) },
      },
      orderBy: { effective_date: "desc" },
    });

    return previous
      ? this.mapper.map<legislation_version, LegislationVersion>(previous, "legislation_version", "LegislationVersion")
      : null;
  }

  private async getNextValidVersion(version: LegislationVersion): Promise<LegislationVersion | null> {
    const next = await this.prisma.legislation_version.findFirst({
      where: {
        legislation_source_guid: version.legislationSourceGuid,
        import_status: "SUCCESS",
        legislation_version_guid: { not: version.legislationVersionGuid },
        effective_date: { gt: toDate(version.effectiveDate) },
      },
      orderBy: { effective_date: "asc" },
    });

    return next
      ? this.mapper.map<legislation_version, LegislationVersion>(next, "legislation_version", "LegislationVersion")
      : null;
  }

  private async validateEffectiveDate(
    previousVersion: LegislationVersion | null,
    effectiveDate: string,
  ): Promise<void> {
    if (!previousVersion) {
      return;
    }

    if (effectiveDate <= previousVersion.effectiveDate) {
      throw new GraphQLError(
        `The effective date must be after ${previousVersion.effectiveDate}, the previous version's effective date.`,
        {},
      );
    }

    const versionGuids = await this.getActAndRegulationVersionGuids(previousVersion.legislationVersionGuid);
    const stats = await this.getContraventionCountByVersion(versionGuids);

    if (stats.latest && effectiveDate <= stats.latest) {
      throw new GraphQLError(
        `The effective date must be after ${stats.latest}, the most recent contravention recorded under the previous version.`,
        {},
      );
    }
  }

  async getContraventionCountByVersion(versionGuids: string[]): Promise<ContraventionStats> {
    if (versionGuids.length === 0) {
      return { count: 0, earliest: null, latest: null };
    }

    const nodes = await this.prisma.legislation.findMany({
      where: { legislation_version_guid: { in: versionGuids } },
      select: { legislation_guid: true },
    });
    const nodeGuids = nodes.map((node) => node.legislation_guid);

    const [totals] = await this.investigationPrisma.$queryRaw<
      { count: number; earliest: Date | null; latest: Date | null }[]
    >`
      SELECT count(*)::int AS count, min(contravention_date) AS earliest, max(contravention_date) AS latest
      FROM contravention
      WHERE legislation_guid_ref = ANY(${nodeGuids}::uuid[])
    `;

    return { count: totals.count, earliest: toDateString(totals.earliest), latest: toDateString(totals.latest) };
  }
}
