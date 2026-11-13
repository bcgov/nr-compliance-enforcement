import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { app_user_activity_xref } from "../../../../prisma/shared/generated/app_user_activity_xref";

export class AppUserActivityXref {
  appUserActivityXrefGuid: string;
  appUserGuid: string;
}

export const mapPrismaAppUserActivityXrefToAppUserActivityXref = (mapper: Mapper) => {
  createMap<app_user_activity_xref, AppUserActivityXref>(
    mapper,
    "app_user_activity_xref",
    "AppUserActivityXref",
    forMember(
      (dest) => dest.appUserActivityXrefGuid,
      mapFrom((src) => src.app_user_activity_xref_guid),
    ),
    forMember(
      (dest) => dest.appUserGuid,
      mapFrom((src) => src.app_user_guid),
    ),
  );
};
