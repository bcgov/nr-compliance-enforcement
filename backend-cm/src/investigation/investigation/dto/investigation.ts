import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";

import { investigation } from "../../../../prisma/investigation/generated/investigation";
import { InvestigationStatusCode } from "../../../investigation/investigation_status_code/dto/investigation_status_code";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "src/common/pagination.utility";
import { PageInfo } from "src/shared/case_file/dto/case_file";
import { IsOptional } from "class-validator";

export class Investigation {
  investigationGuid: string;
  description?: string;
  leadAgency: string;
  investigationStatus: InvestigationStatusCode;
  openedTimestamp: Date;
  caseIdentifier: string;
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
}

@InputType()
export class UpdateInvestigationInput {
  @Field(() => String)
  leadAgency: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  investigationStatus: string;
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
      (dest) => dest.openedTimestamp,
      mapFrom((src) => src.investigation_opened_utc_timestamp),
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
