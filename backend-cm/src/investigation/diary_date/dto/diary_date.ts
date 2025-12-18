import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { diary_date } from "../../../../prisma/investigation/generated/diary_date";

export class DiaryDate {
  diaryDateGuid: string;
  investigationGuid: string;
  dueDate: Date;
  description: string;
  addedTimestamp: Date;
  addedUserGuid: string;
  updatedTimestamp: Date;
  updatedUserGuid: string;
}

@InputType()
export class DiaryDateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  diaryDateGuid?: string;

  @Field(() => String)
  investigationGuid: string;

  @Field(() => Date)
  dueDate: Date;

  @Field(() => String)
  description: string;

  @Field(() => String)
  userGuid?: string;
}

export const mapPrismaDiaryDateToDiaryDate = (mapper: Mapper) => {
  createMap<diary_date, DiaryDate>(
    mapper,
    "diary_date",
    "DiaryDate",
    forMember(
      (dest) => dest.diaryDateGuid,
      mapFrom((src) => src.diary_date_guid),
    ),
    forMember(
      (dest) => dest.investigationGuid,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.dueDate,
      mapFrom((src) => src.due_date),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.description),
    ),
    forMember(
      (dest) => dest.addedTimestamp,
      mapFrom((src) => src.added_utc_timestamp),
    ),
    forMember(
      (dest) => dest.addedUserGuid,
      mapFrom((src) => src.added_user_guid),
    ),
    forMember(
      (dest) => dest.updatedTimestamp,
      mapFrom((src) => src.updated_utc_timestamp),
    ),
    forMember(
      (dest) => dest.updatedUserGuid,
      mapFrom((src) => src.updated_user_guid),
    ),
  );
};
