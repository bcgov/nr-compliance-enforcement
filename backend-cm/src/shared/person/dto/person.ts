import { ContactMethod } from "../../contact_method/dto/contact_method";
import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { person } from "../../../../prisma/shared/generated/person";
import { PersonDto } from "../../../common/party";

export class Person implements PersonDto {
  personGuid: string;
  partyGuid: string;
  firstName: string;
  middleName?: string;
  middleName2?: string;
  lastName: string;
  dateOfBirth?: Date;
  driversLicenseNumber?: string;
  driversLicenseJurisdiction?: string;
  sexCode?: string;
  contactMethods?: ContactMethod[];
}

export const mapPrismaPersonToPerson = (mapper: Mapper) => {
  createMap<person, Person>(
    mapper,
    "person",
    "Person",
    forMember(
      (dest) => dest.personGuid,
      mapFrom((src) => src.person_guid),
    ),
    forMember(
      (dest) => dest.firstName,
      mapFrom((src) => src.first_name),
    ),
    forMember(
      (dest) => dest.middleName,
      mapFrom((src) => src.middle_name),
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
      (dest) => dest.dateOfBirth,
      mapFrom((src) => src.date_of_birth ?? undefined),
    ),
    forMember(
      (dest) => dest.driversLicenseNumber,
      mapFrom((src) => src.drivers_license_number ?? undefined),
    ),
    forMember(
      (dest) => dest.driversLicenseJurisdiction,
      mapFrom((src) => src.drivers_license_jurisdiction ?? undefined),
    ),
    forMember(
      (dest) => dest.sexCode,
      mapFrom((src) => src.sex_code ?? undefined),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) => mapper.mapArray(src.contact_method ?? [], "contact_method", "ContactMethod")),
    ),
  );
};
