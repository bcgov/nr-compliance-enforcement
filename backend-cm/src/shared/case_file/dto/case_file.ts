import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { AgencyCode } from "../../agency_code/dto/agency_code";
import { CaseActivity } from "../../case_activity/dto/case_activity";
import { CaseStatusCode } from "../../case_status_code/dto/case_status_code";
import { case_file } from "../../../../prisma/shared/generated/case_file";
import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";
import { IsOptional, Min, Max } from "class-validator";
import { PaginationMetadata, PaginatedResult } from "../../../common/pagination.utility";

export class CaseFile {
  caseIdentifier: string;
  openedTimestamp: Date;
  leadAgency: AgencyCode;
  caseStatus: CaseStatusCode;
  description?: string;
  name: string;
  createdByAppUserGuid?: string;
  activities: CaseActivity[];
}

@InputType()
export class CaseFileCreateInput {
  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  caseStatus: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  activityType?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  activityIdentifier?: string;
}

@InputType()
export class CaseFileUpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  leadAgency?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  caseStatus?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;
}

@InputType()
export class CaseFileFilters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  leadAgency?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  caseStatus?: string;

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

@ObjectType()
export class PageInfo implements PaginationMetadata {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageSize: number;
}

@ObjectType()
export class CaseFileResult implements PaginatedResult<CaseFile> {
  @Field(() => [CaseFile])
  items: CaseFile[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

export const mapPrismaCaseFileToCaseFile = (mapper: Mapper) => {
  createMap<case_file, CaseFile>(
    mapper,
    "case_file",
    "CaseFile",
    forMember(
      (dest) => dest.caseIdentifier,
      mapFrom((src) => src.case_file_guid),
    ),
    forMember(
      (dest) => dest.openedTimestamp,
      mapFrom((src) => src.opened_utc_timestamp),
    ),
    forMember(
      (dest) => dest.leadAgency,
      mapFrom((src) => mapper.map(src.agency_code, "agency_code", "AgencyCode")),
    ),
    forMember(
      (dest) => dest.caseStatus,
      mapFrom((src) => mapper.map(src.case_status_code, "case_status_code", "CaseStatusCode")),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.description),
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
      (dest) => dest.activities,
      mapWithArguments((src) => mapper.mapArray(src.case_activity ?? [], "case_activity", "CaseActivity")),
    ),
  );
};
