import { ContactMethod } from "../../contact_method/dto/contact_method";
import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { person } from "../../../../prisma/shared/generated/person";
import { PersonDto } from "../../../common/party";

export class Person implements PersonDto {
  personGuid: string;
  partyGuid: string;
  firstName: string;
  middleNames?: string;
  lastName: string;
  dateOfBirth?: Date;
  approximateAgeCode?: string;
  driversLicenseNumber?: string;
  driversLicenseClass?: string;
  driversLicenseCountryCode?: string;
  driversLicenseCountrySubdivisionCode?: string;
  genderCode?: string;
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
      (dest) => dest.middleNames,
      mapFrom((src) => src.middle_names),
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
      (dest) => dest.driversLicenseClass,
      mapFrom((src) => src.drivers_license_class ?? undefined),
    ),
    forMember(
      (dest) => dest.driversLicenseCountryCode,
      mapFrom((src) => src.drivers_license_country_code ?? undefined),
    ),
    forMember(
      (dest) => dest.driversLicenseCountrySubdivisionCode,
      mapFrom((src) => src.drivers_license_country_subdivision_code ?? undefined),
    ),
    forMember(
      (dest) => dest.genderCode,
      mapFrom((src) => src.gender_code ?? undefined),
    ),
    forMember(
      (dest) => dest.approximateAgeCode,
      mapFrom((src) => src.approximate_age_code ?? undefined),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) => mapper.mapArray(src.contact_method ?? [], "contact_method", "ContactMethod")),
    ),
  );
};
