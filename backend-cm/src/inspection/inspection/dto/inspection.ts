import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";

import { inspection } from "../../../../prisma/inspection/generated/inspection";
import { InspectionStatusCode } from "../../../inspection/inspection_status_code/dto/inspection_status_code";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "src/common/pagination.utility";
import { PageInfo } from "src/shared/case_file/dto/case_file";
import { IsOptional } from "class-validator";

export class Inspection {
  inspectionGuid: string;
  description?: string;
  leadAgency: string;
  inspectionStatus: InspectionStatusCode;
  openedTimestamp: Date;
  caseIdentifier: string;
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
}

@InputType()
export class UpdateInspectionInput {
  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  inspectionStatus: string;
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
  );
};

@ObjectType()
export class InspectionResult implements PaginatedResult<Inspection> {
  @Field(() => [Inspection])
  items: Inspection[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
