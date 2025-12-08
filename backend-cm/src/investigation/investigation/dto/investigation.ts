import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";

import { investigation } from "../../../../prisma/investigation/investigation.unsupported_types";
import { InvestigationStatusCode } from "../../../investigation/investigation_status_code/dto/investigation_status_code";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "src/common/pagination.utility";
import { PageInfo } from "src/shared/case_file/dto/case_file";
import { IsOptional } from "class-validator";
import { Point, PointScalar } from "src/common/custom_scalars";
import { InvestigationParty } from "src/investigation/investigation_party/dto/investigation_party";
import { Contravention } from "../../../investigation/contravention/dto/contravention";

export class Investigation {
  investigationGuid: string;
  description?: string;
  leadAgency: string;
  investigationStatus: InvestigationStatusCode;
  openedTimestamp: Date;
  caseIdentifier: string;
  createdByAppUserGuid?: string;
  locationGeometry?: Point;
  locationAddress?: string;
  locationDescription?: string;
  name: string;
  supervisorGuid: string;
  primaryInvestigatorGuid: string;
  fileCoordinatorGuid?: string;
  discoveryDate: Date;
  parties: [InvestigationParty];
  contraventions: [Contravention];
}

@InputType()
export class InvestigationFilters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  leadAgency?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  investigationStatus?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortOrder?: string;
}

@InputType()
export class CreateInvestigationInput {
  @Field(() => String)
  caseIdentifier: string;

  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  investigationStatus: string;

  @Field(() => PointScalar, { nullable: true })
  @IsOptional()
  locationGeometry?: Point;

  @Field(() => String)
  @IsOptional()
  locationDescription: string;

  @Field(() => String)
  @IsOptional()
  locationAddress: string;

  @Field(() => String)
  @IsOptional()
  name: string;

  @Field(() => String)
  createdByAppUserGuid: string;

  @Field(() => String)
  supervisorGuid: string;

  @Field(() => String)
  primaryInvestigatorGuid: string;

  @Field(() => String)
  @IsOptional()
  fileCoordinatorGuid: string;

  @Field(() => Date)
  discoveryDate: Date;
}

@InputType()
export class UpdateInvestigationInput {
  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  investigationStatus: string;

  @Field(() => PointScalar, { nullable: true })
  @IsOptional()
  locationGeometry?: Point;

  @Field(() => String)
  @IsOptional()
  locationDescription?: string;

  @Field(() => String)
  @IsOptional()
  locationAddress?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String)
  supervisorGuid: string;

  @Field(() => String)
  primaryInvestigatorGuid: string;

  @Field(() => String)
  @IsOptional()
  fileCoordinatorGuid?: string;

  @Field(() => Date)
  discoveryDate: Date;
}

export const mapPrismaInvestigationToInvestigation = (mapper: Mapper) => {
  createMap<investigation, Investigation>(
    mapper,
    "investigation",
    "Investigation",
    forMember(
      (dest) => dest.investigationGuid,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.investigation_description),
    ),
    forMember(
      (dest) => dest.leadAgency,
      mapFrom((src) => src.owned_by_agency_ref),
    ),
    forMember(
      (dest) => dest.investigationStatus,
      mapFrom((src) =>
        mapper.map(src.investigation_status_code, "investigation_status_code", "InvestigationStatusCode"),
      ),
    ),
    forMember(
      (dest) => dest.locationDescription,
      mapFrom((src) => src.location_description),
    ),
    forMember(
      (dest) => dest.locationAddress,
      mapFrom((src) => src.location_address),
    ),
    forMember(
      (dest) => dest.openedTimestamp,
      mapFrom((src) => src.investigation_opened_utc_timestamp),
    ),
    forMember(
      (dest) => dest.locationGeometry,
      mapFrom((src) => src.location_geometry_point),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.createdByAppUserGuid,
      mapFrom((src) => src.created_by_app_user_guid_ref),
    ),
    forMember(
      (dest) => dest.supervisorGuid,
      mapFrom((src) => src.supervisor_guid_ref),
    ),
    forMember(
      (dest) => dest.primaryInvestigatorGuid,
      mapFrom((src) => src.primary_investigator_guid_ref),
    ),
    forMember(
      (dest) => dest.fileCoordinatorGuid,
      mapFrom((src) => src.file_coordinator_guid_ref),
    ),
    forMember(
      (dest) => dest.discoveryDate,
      mapFrom((src) => src.discovery_date),
    ),
    forMember(
      (dest) => dest.parties,
      mapFrom((src) => mapper.mapArray(src.investigation_party ?? [], "investigation_party", "InvestigationParty")),
    ),
    forMember(
      (dest) => dest.contraventions,
      mapFrom((src) => mapper.mapArray(src.contravention ?? [], "contravention", "Contravention")),
    ),
  );
};

@ObjectType()
export class InvestigationResult implements PaginatedResult<Investigation> {
  @Field(() => [Investigation])
  items: Investigation[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
