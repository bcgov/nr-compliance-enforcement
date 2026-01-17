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
    const sources = await this.prisma.legislation_source.findMany({
      where: {
        active_ind: true,
        imported_ind: false,
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
        active_ind: true,
        imported_ind: false,
        import_status: "PENDING",
        create_user_id: input.createUserId,
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
      await this.prisma.legislation_source.delete({
        where: { legislation_source_guid: legislationSourceGuid },
      });
      return true;
    } catch {
      return false;
    }
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

  private mapToDto(source: any): LegislationSource {
    return {
      legislationSourceGuid: source.legislation_source_guid,
      shortDescription: source.short_description,
      longDescription: source.long_description,
      sourceUrl: source.source_url,
      regulationsSourceUrl: source.regulations_source_url ?? null,
      agencyCode: source.agency_code,
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
