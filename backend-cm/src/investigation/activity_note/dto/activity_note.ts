import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";

import { activity_note } from "../../../../prisma/investigation/generated/activity_note";
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

export class ActivityNote {
  activityNoteGuid: string;
  investigationGuid: string;
  activityNoteCode: string;
  contentJson: string;
  contentText: string;
  actionedTimestamp: Date;
  reportedTimestamp: Date;
  actionedAppUserGuidRef: string;
  reportedAppUserGuidRef: string;
}

@InputType()
export class ActivityNoteInput {
  @Field(() => String)
  investigationGuid: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  activityNoteGuid?: string;

  @Field(() => String)
  activityNoteCode: string;

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

export const mapPrismaActivityNoteToActivityNote = (mapper: Mapper) => {
  createMap<activity_note, ActivityNote>(
    mapper,
    "activity_note",
    "ActivityNote",
    forMember(
      (dest) => dest.activityNoteGuid,
      mapFrom((src) => src.activity_note_guid),
    ),
    forMember(
      (dest) => dest.investigationGuid,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.activityNoteCode,
      mapFrom((src) => src.activity_note_code),
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
