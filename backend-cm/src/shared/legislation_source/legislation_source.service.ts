import { Injectable } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { LegislationService } from "../legislation/legislation.service";
import { LegislationVersionService } from "../legislation_version/legislation_version.service";
import {
  LegislationSource,
  CreateLegislationSourceInput,
  UpdateLegislationSourceInput,
} from "./dto/legislation-source";

@Injectable()
export class LegislationSourceService {
  constructor(
    private readonly prisma: SharedPrismaService,
    private readonly legislationService: LegislationService,
    private readonly legislationVersionService: LegislationVersionService,
  ) {}

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

  async getAgencyCode(legislationSourceGuid: string): Promise<string> {
    const source = await this.prisma.legislation_source.findUnique({
      where: { legislation_source_guid: legislationSourceGuid },
      select: { agency_code: true },
    });

    if (!source) {
      throw new GraphQLError("Legislation source not found", {});
    }

    return source.agency_code;
  }

  async create(input: CreateLegislationSourceInput): Promise<LegislationSource> {
    const effectiveDate = input.effectiveDate ?? "1900-01-01";

    const source = await this.prisma.$transaction(async (tx) => {
      const created = await tx.legislation_source.create({
        data: {
          short_description: input.shortDescription,
          long_description: input.longDescription ?? null,
          source_url: input.sourceUrl,
          regulations_source_url: input.regulationsSourceUrl ?? null,
          agency_code: input.agencyCode,
          source_type: input.sourceType ?? "BCLAWS",
          active_ind: true,
          create_user_id: input.createUserId,
          create_utc_timestamp: new Date(),
        },
      });

      await this.legislationVersionService.create(
        created.legislation_source_guid,
        effectiveDate,
        input.createUserId,
        tx,
      );

      return created;
    });

    return this.mapToDto(source);
  }

  async upsertRegulationSource(
    parentSourceGuid: string,
    externalKey: string,
    title: string,
    sourceType: string = "BCLAWS",
  ): Promise<LegislationSource> {
    const parent = await this.prisma.legislation_source.findUnique({
      where: { legislation_source_guid: parentSourceGuid },
    });

    if (!parent) {
      throw new GraphQLError("Parent legislation source not found", {});
    }

    const existing = await this.prisma.legislation_source.findFirst({
      where: { parent_legislation_source_guid: parentSourceGuid, external_key: externalKey },
    });

    if (existing) {
      if (existing.short_description === title) {
        return this.mapToDto(existing);
      }

      const updated = await this.prisma.legislation_source.update({
        where: { legislation_source_guid: existing.legislation_source_guid },
        data: {
          short_description: title,
          update_user_id: "system",
          update_utc_timestamp: new Date(),
        },
      });

      return this.mapToDto(updated);
    }

    const source = await this.prisma.legislation_source.create({
      data: {
        short_description: title,
        long_description: null,
        source_url: null,
        regulations_source_url: null,
        agency_code: parent.agency_code,
        source_type: sourceType,
        parent_legislation_source_guid: parentSourceGuid,
        external_key: externalKey,
        active_ind: true,
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
        update_user_id: input.updateUserId,
        update_utc_timestamp: new Date(),
      },
    });

    return this.mapToDto(source);
  }

  async delete(legislationSourceGuid: string): Promise<boolean> {
    const source = await this.prisma.legislation_source.findUnique({
      where: { legislation_source_guid: legislationSourceGuid },
    });

    if (!source) {
      throw new GraphQLError("Legislation source not found", {});
    }

    const childSources = await this.prisma.legislation_source.findMany({
      where: { parent_legislation_source_guid: legislationSourceGuid },
      select: { legislation_source_guid: true },
    });
    const childSourceGuids = childSources.map((child) => child.legislation_source_guid);
    const sourceGuids = [legislationSourceGuid, ...childSourceGuids];

    const versions = await this.prisma.legislation_version.findMany({
      where: { legislation_source_guid: { in: sourceGuids } },
      select: { legislation_version_guid: true },
    });
    const versionGuids = versions.map((version) => version.legislation_version_guid);

    const referencingContraventionCount = (
      await this.legislationVersionService.getContraventionCountByVersion(versionGuids)
    ).count;
    if (referencingContraventionCount > 0) {
      throw new GraphQLError(
        `This source is referenced by ${referencingContraventionCount} recorded contravention(s) and cannot be deleted.`,
        {},
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // Trees go first; the node FK is ON DELETE SET NULL and would silently orphan them
      await this.legislationService.deleteByVersion(versionGuids, tx);

      await tx.legislation_version.deleteMany({
        where: { legislation_source_guid: { in: sourceGuids }, parent_legislation_version_guid: { not: null } },
      });

      await tx.legislation_version.deleteMany({
        where: { legislation_source_guid: { in: sourceGuids } },
      });

      if (childSourceGuids.length > 0) {
        await tx.legislation_source.deleteMany({
          where: { legislation_source_guid: { in: childSourceGuids } },
        });
      }

      await tx.legislation_source.delete({
        where: { legislation_source_guid: legislationSourceGuid },
      });
    });

    return true;
  }

  private mapToDto(source: any): LegislationSource {
    return {
      legislationSourceGuid: source.legislation_source_guid,
      shortDescription: source.short_description,
      longDescription: source.long_description,
      sourceUrl: source.source_url ?? "",
      regulationsSourceUrl: source.regulations_source_url ?? null,
      agencyCode: source.agency_code,
      sourceType: source.source_type ?? "BCLAWS",
      activeInd: source.active_ind,
      parentLegislationSourceGuid: source.parent_legislation_source_guid ?? null,
      externalKey: source.external_key ?? null,
      createUserId: source.create_user_id,
      createUtcTimestamp: source.create_utc_timestamp,
    };
  }
}
