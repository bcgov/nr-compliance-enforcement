import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { app_user_team_xref } from "../../../../prisma/shared/generated/app_user_team_xref";
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

export class AppUserTeamXref {
  appUserTeamXrefGuid: string;
  appUserGuid: string;
  teamGuid: string;
  activeIndicator: boolean;
}

@InputType()
export class CreateAppUserTeamXrefInput {
  @Field(() => String)
  appUserGuid: string;

  @Field(() => String)
  teamGuid: string;

  @Field(() => Boolean)
  activeIndicator: boolean;
}

@InputType()
export class UpdateAppUserTeamXrefInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  teamGuid?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  activeIndicator?: boolean;
}

export const mapPrismaAppUserTeamXrefToAppUserTeamXref = (mapper: Mapper) => {
  createMap<app_user_team_xref, AppUserTeamXref>(
    mapper,
    "app_user_team_xref",
    "AppUserTeamXref",
    forMember(
      (dest) => dest.appUserTeamXrefGuid,
      mapFrom((src) => src.app_user_team_xref_guid),
    ),
    forMember(
      (dest) => dest.appUserGuid,
      mapFrom((src) => src.app_user_guid),
    ),
    forMember(
      (dest) => dest.teamGuid,
      mapFrom((src) => src.team_guid),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
