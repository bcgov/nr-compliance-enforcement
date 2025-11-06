import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";

import { inspection } from "../../../../prisma/inspection/inspection.unsupported_types";
import { InspectionStatusCode } from "../../../inspection/inspection_status_code/dto/inspection_status_code";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "src/common/pagination.utility";
import { PageInfo } from "src/shared/case_file/dto/case_file";
import { IsOptional } from "class-validator";
import { Point, PointScalar } from "src/common/custom_scalars";
import { InspectionParty } from "src/inspection/inspection_party/dto/inspection_party";

export class Inspection {
  inspectionGuid: string;
  description?: string;
  leadAgency: string;
  inspectionStatus: InspectionStatusCode;
  openedTimestamp: Date;
  name: string;
  createdByAppUserGuid?: string;
  locationGeometry?: Point;
  locationAddress?: string;
  locationDescription?: string;
  parties: [InspectionParty];
}

@InputType()
export class InspectionFilters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  leadAgency?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  inspectionStatus?: string;

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
export class CreateInspectionInput {
  @Field(() => String)
  caseIdentifier: string;

  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  inspectionStatus: string;

  @Field(() => String)
  name: string;

  @Field(() => PointScalar, { nullable: true })
  @IsOptional()
  locationGeometry?: Point;

  @Field(() => String)
  @IsOptional()
  locationDescription: string;

  @Field(() => String)
  @IsOptional()
  locationAddress: string;
}

@InputType()
export class UpdateInspectionInput {
  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  inspectionStatus: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => PointScalar, { nullable: true })
  @IsOptional()
  locationGeometry?: Point;

  @Field(() => String)
  @IsOptional()
  locationDescription: string;

  @Field(() => String)
  @IsOptional()
  locationAddress: string;
}

export const mapPrismaInspectionToInspection = (mapper: Mapper) => {
  createMap<inspection, Inspection>(
    mapper,
    "inspection",
    "Inspection",
    forMember(
      (dest) => dest.inspectionGuid,
      mapFrom((src) => src.inspection_guid),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.inspection_description),
    ),
    forMember(
      (dest) => dest.leadAgency,
      mapFrom((src) => src.owned_by_agency_ref),
    ),
    forMember(
      (dest) => dest.inspectionStatus,
      mapFrom((src) => mapper.map(src.inspection_status_code, "inspection_status_code", "InspectionStatusCode")),
    ),
    forMember(
      (dest) => dest.openedTimestamp,
      mapFrom((src) => src.inspection_opened_utc_timestamp),
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
      (dest) => dest.locationDescription,
      mapFrom((src) => src.location_description),
    ),
    forMember(
      (dest) => dest.locationAddress,
      mapFrom((src) => src.location_address),
    ),
    forMember(
      (dest) => dest.locationGeometry,
      mapFrom((src) => src.location_geometry_point),
    ),
    forMember(
      (dest) => dest.parties,
      mapFrom((src) => mapper.mapArray(src.inspection_party ?? [], "inspection_party", "InspectionParty")),
    ),
  );
};

@ObjectType()
export class InspectionResult implements PaginatedResult<Inspection> {
  @Field(() => [Inspection])
  items: Inspection[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
