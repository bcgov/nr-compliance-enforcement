import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";

import { continuation_report } from "../../../../prisma/investigation/generated/continuation_report";
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

export class ContinuationReport {
  continuationReportGuid: string;
  investigationGuid: string;
  contentJson: string;
  contentText: string;
  actionedTimestamp: Date;
  reportedTimestamp: Date;
  actionedAppUserGuidRef: string;
  reportedAppUserGuidRef: string;
}

@InputType()
export class ContinuationReportInput {
  @Field(() => String)
  investigationGuid: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  continuationReportGuid?: string;

  @Field(() => String)
  contentJson: string;

  @Field(() => String)
  contentText: string;

  @Field(() => Date)
  actionedTimestamp: Date;

  @Field(() => Date)
  reportedTimestamp: Date;

  @Field(() => String)
  actionedAppUserGuidRef: string;

  @Field(() => String)
  reportedAppUserGuidRef: string;
}

export const mapPrismaContinuationReportToContinuationReport = (mapper: Mapper) => {
  createMap<continuation_report, ContinuationReport>(
    mapper,
    "continuation_report",
    "ContinuationReport",
    forMember(
      (dest) => dest.continuationReportGuid,
      mapFrom((src) => src.continuation_report_guid),
    ),
    forMember(
      (dest) => dest.investigationGuid,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.contentJson,
      mapFrom((src) => (src.content_json == null ? null : JSON.stringify(src.content_json))),
    ),
    forMember(
      (dest) => dest.contentText,
      mapFrom((src) => src.content_text),
    ),
    forMember(
      (dest) => dest.actionedTimestamp,
      mapFrom((src) => src.actioned_utc_timestamp),
    ),
    forMember(
      (dest) => dest.reportedTimestamp,
      mapFrom((src) => src.reported_utc_timestamp),
    ),
    forMember(
      (dest) => dest.actionedAppUserGuidRef,
      mapFrom((src) => src.actioned_app_user_guid_ref),
    ),
    forMember(
      (dest) => dest.reportedAppUserGuidRef,
      mapFrom((src) => src.reported_app_user_guid_ref),
    ),
  );
};
