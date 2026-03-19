import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import {
  LegislationSource,
  CreateLegislationSourceInput,
  UpdateLegislationSourceInput,
  ImportStatus,
} from "./dto/legislation-source";

@Injectable()
export class LegislationSourceService {
  constructor(private readonly prisma: SharedPrismaService) {}

  private readonly logger = new Logger(LegislationSourceService.name);

  async getAll(): Promise<LegislationSource[]> {
    const sources = await this.prisma.legislation_source.findMany({
      orderBy: [{ agency_code: "asc" }, { short_description: "asc" }],
    });

    return sources.map((source) => this.mapToDto(source));
  }

  async getById(legislationSourceGuid: string): Promise<LegislationSource | null> {
    const source = await this.prisma.legislation_source.findUnique({
      where: { legislation_source_guid: legislationSourceGuid },
    });

    if (!source) {
      return null;
    }

    return this.mapToDto(source);
  }

  async getPending(): Promise<LegislationSource[]> {
    return this.getPendingBySourceType("BCLAWS");
  }

  async getPendingBySourceType(sourceType: string): Promise<LegislationSource[]> {
    const sources = await this.prisma.legislation_source.findMany({
      where: {
        active_ind: true,
        imported_ind: false,
        source_type: sourceType,
      },
      orderBy: {
        short_description: "asc",
      },
    });

    return sources.map((source) => this.mapToDto(source));
  }

  async create(input: CreateLegislationSourceInput): Promise<LegislationSource> {
    const source = await this.prisma.legislation_source.create({
      data: {
        short_description: input.shortDescription,
        long_description: input.longDescription ?? null,
        source_url: input.sourceUrl,
        regulations_source_url: input.regulationsSourceUrl ?? null,
        agency_code: input.agencyCode,
        source_type: input.sourceType ?? "BCLAWS",
        active_ind: true,
        imported_ind: false,
        import_status: "PENDING",
        create_user_id: input.createUserId,
        create_utc_timestamp: new Date(),
      },
    });

    return this.mapToDto(source);
  }

  async createRegulationSource(
    agencyCode: string,
    shortDescription: string,
    sourceUrl: string,
    sourceType: string = "BCLAWS",
  ): Promise<LegislationSource> {
    const source = await this.prisma.legislation_source.create({
      data: {
        short_description: shortDescription.slice(0, 64),
        long_description: null,
        source_url: sourceUrl,
        regulations_source_url: null,
        agency_code: agencyCode,
        source_type: sourceType,
        active_ind: true,
        imported_ind: true,
        import_status: "SUCCESS",
        create_user_id: "system",
        create_utc_timestamp: new Date(),
      },
    });
    return this.mapToDto(source);
  }

  async update(input: UpdateLegislationSourceInput): Promise<LegislationSource> {
    const source = await this.prisma.legislation_source.update({
      where: { legislation_source_guid: input.legislationSourceGuid },
      data: {
        ...(input.shortDescription !== undefined && { short_description: input.shortDescription }),
        ...(input.longDescription !== undefined && { long_description: input.longDescription }),
        ...(input.sourceUrl !== undefined && { source_url: input.sourceUrl }),
        ...(input.regulationsSourceUrl !== undefined && { regulations_source_url: input.regulationsSourceUrl }),
        ...(input.agencyCode !== undefined && { agency_code: input.agencyCode }),
        ...(input.activeInd !== undefined && { active_ind: input.activeInd }),
        ...(input.importedInd !== undefined && { imported_ind: input.importedInd }),
        update_user_id: input.updateUserId,
        update_utc_timestamp: new Date(),
      },
    });

    return this.mapToDto(source);
  }

  async delete(legislationSourceGuid: string): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Find root legislation record
        const rootLegislation = await tx.legislation.findMany({
          where: { legislation_source_guid: legislationSourceGuid },
          select: { legislation_guid: true },
        });

        if (rootLegislation.length > 0) {
          // get all legislation_guids
          const allLegislationGuids = await this.getChildLegislationGuids(
            tx,
            rootLegislation.map((l) => l.legislation_guid),
          );

          // delete legislation_configuration records
          await tx.legislation_configuration.deleteMany({
            where: { legislation_guid: { in: allLegislationGuids } },
          });

          // delete legislation records
          await tx.legislation.deleteMany({
            where: { legislation_guid: { in: allLegislationGuids } },
          });
        }

        // delete legislation_source record
        await tx.legislation_source.delete({
          where: { legislation_source_guid: legislationSourceGuid },
        });
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete legislation source ${legislationSourceGuid}:`, error);
      return false;
    }
  }

  private async getChildLegislationGuids(tx: any, parentGuids: string[]): Promise<string[]> {
    const allGuids = [...parentGuids];
    let currentLevel = parentGuids;

    while (currentLevel.length > 0) {
      const children = await tx.legislation.findMany({
        where: { parent_legislation_guid: { in: currentLevel } },
        select: { legislation_guid: true },
      });

      currentLevel = children.map((c: { legislation_guid: string }) => c.legislation_guid);
      allGuids.push(...currentLevel);
    }

    return allGuids;
  }

  async markImported(legislationSourceGuid: string, log?: string): Promise<void> {
    await this.prisma.legislation_source.update({
      where: {
        legislation_source_guid: legislationSourceGuid,
      },
      data: {
        imported_ind: true,
        import_status: "SUCCESS",
        last_import_timestamp: new Date(),
        last_import_log: log ?? null,
        update_user_id: "system",
        update_utc_timestamp: new Date(),
      },
    });
  }

  async markFailed(legislationSourceGuid: string, errorLog: string): Promise<void> {
    await this.prisma.legislation_source.update({
      where: {
        legislation_source_guid: legislationSourceGuid,
      },
      data: {
        import_status: "FAILED",
        last_import_timestamp: new Date(),
        last_import_log: errorLog,
        update_user_id: "system",
        update_utc_timestamp: new Date(),
      },
    });
  }

  async resetImport(legislationSourceGuid: string, updateUserId: string): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Find root legislation record
        const rootLegislation = await tx.legislation.findMany({
          where: { legislation_source_guid: legislationSourceGuid },
          select: { legislation_guid: true },
        });

        if (rootLegislation.length > 0) {
          // get all legislation_guids
          const allLegislationGuids = await this.getChildLegislationGuids(
            tx,
            rootLegislation.map((l) => l.legislation_guid),
          );

          // find regulation legislation_source records created to store the URL
          const regulationSources = await tx.legislation.findMany({
            where: {
              legislation_guid: { in: allLegislationGuids },
              legislation_source_guid: { not: legislationSourceGuid },
            },
            select: { legislation_source_guid: true },
          });
          const regulationSourceGuids = [
            ...new Set(regulationSources.map((r) => r.legislation_source_guid).filter(Boolean)),
          ];

          // delete legislation_configuration records
          await tx.legislation_configuration.deleteMany({
            where: { legislation_guid: { in: allLegislationGuids } },
          });

          // delete legislation records
          await tx.legislation.deleteMany({
            where: { legislation_guid: { in: allLegislationGuids } },
          });

          // delete regulation legislation_source records (not the act itself)
          if (regulationSourceGuids.length > 0) {
            await tx.legislation_source.deleteMany({
              where: { legislation_source_guid: { in: regulationSourceGuids } },
            });
          }
        }

        // reset legislation_source record
        await tx.legislation_source.update({
          where: { legislation_source_guid: legislationSourceGuid },
          data: {
            imported_ind: false,
            last_import_timestamp: null,
            import_status: null,
            last_import_log: null,
            active_ind: false,
            update_user_id: updateUserId,
            update_utc_timestamp: new Date(),
          },
        });
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to reset import for legislation source ${legislationSourceGuid}:`, error);
      return false;
    }
  }

  private mapToDto(source: any): LegislationSource {
    return {
      legislationSourceGuid: source.legislation_source_guid,
      shortDescription: source.short_description,
      longDescription: source.long_description,
      sourceUrl: source.source_url,
      regulationsSourceUrl: source.regulations_source_url ?? null,
      agencyCode: source.agency_code,
      sourceType: source.source_type ?? "BCLAWS",
      activeInd: source.active_ind,
      importedInd: source.imported_ind,
      importStatus: source.import_status as ImportStatus | null,
      lastImportTimestamp: source.last_import_timestamp?.toISOString() ?? null,
      lastImportLog: source.last_import_log,
      createUserId: source.create_user_id,
      createUtcTimestamp: source.create_utc_timestamp,
    };
  }
}
