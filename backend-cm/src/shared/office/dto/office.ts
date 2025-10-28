import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { office } from "../../../../prisma/shared/generated/office";

export class Office {
  officeGuid: string;
  geoOrganizationUnitCode: string;
  agencyCode: string;
  createUserId: string;
  createTimestamp: Date;
  updateUserId: string;
  updateTimestamp: Date;
}

export const mapPrismaOfficeToOffice = (mapper: Mapper) => {
  createMap<office, Office>(
    mapper,
    "office",
    "Office",
    forMember(
      (dest) => dest.officeGuid,
      mapFrom((src) => src.office_guid),
    ),
    forMember(
      (dest) => dest.geoOrganizationUnitCode,
      mapFrom((src) => src.geo_organization_unit_code),
    ),
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code_ref),
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
