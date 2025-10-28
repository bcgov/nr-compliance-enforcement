import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { app_user } from "../../../../prisma/shared/generated/app_user";

export class AppUser {
  appUserGuid: string;
  authUserGuid: string;
  userId: string;
  firstName: string;
  middleName1: string;
  middleName2: string;
  lastName: string;
  comsEnrolledIndicator: boolean;
  deactivateIndicator: boolean;
  agencyCode: string;
  officeGuid: string;
  parkAreaGuid: string;
  createUserId: string;
  createTimestamp: Date;
  updateUserId: string;
  updateTimestamp: Date;
}

export const mapPrismaAppUserToAppUser = (mapper: Mapper) => {
  createMap<app_user, AppUser>(
    mapper,
    "app_user",
    "AppUser",
    forMember(
      (dest) => dest.appUserGuid,
      mapFrom((src) => src.app_user_guid),
    ),
    forMember(
      (dest) => dest.authUserGuid,
      mapFrom((src) => src.auth_user_guid),
    ),
    forMember(
      (dest) => dest.userId,
      mapFrom((src) => src.user_id),
    ),
    forMember(
      (dest) => dest.firstName,
      mapFrom((src) => src.first_name),
    ),
    forMember(
      (dest) => dest.middleName1,
      mapFrom((src) => src.middle_name_1),
    ),
    forMember(
      (dest) => dest.middleName2,
      mapFrom((src) => src.middle_name_2),
    ),
    forMember(
      (dest) => dest.lastName,
      mapFrom((src) => src.last_name),
    ),
    forMember(
      (dest) => dest.comsEnrolledIndicator,
      mapFrom((src) => src.coms_enrolled_ind),
    ),
    forMember(
      (dest) => dest.deactivateIndicator,
      mapFrom((src) => src.deactivate_ind),
    ),
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code_ref),
    ),
    forMember(
      (dest) => dest.officeGuid,
      mapFrom((src) => src.office_guid),
    ),
    forMember(
      (dest) => dest.parkAreaGuid,
      mapFrom((src) => src.park_area_guid),
    ),
    forMember(
      (dest) => dest.createUserId,
      mapFrom((src) => src.create_user_id),
    ),
    forMember(
      (dest) => dest.createTimestamp,
      mapFrom((src) => src.create_utc_timestamp),
    ),
    forMember(
      (dest) => dest.updateUserId,
      mapFrom((src) => src.update_user_id),
    ),
    forMember(
      (dest) => dest.updateTimestamp,
      mapFrom((src) => src.update_utc_timestamp),
    ),
  );
};
