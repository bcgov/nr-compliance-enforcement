import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { person } from "../../../../prisma/shared/generated/person";
import { PersonDto } from "../../../common/party";
import { PersonFacialHairStyleCode } from "src/shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";

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
  heightInCm?: number;
  weightInKg?: number;
  complexionCode?: string;
  buildCode?: string;
  hairColourCode?: string;
  hairLengthCode?: string;
  hairColourOther?: string;
  eyeColourCode?: string;
  eyeColourOther?: string;
  facialHairStyleCodes?: [PersonFacialHairStyleCode];
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
      (dest) => dest.heightInCm,
      mapFrom((src) => src.height_cm ?? undefined),
    ),
    forMember(
      (dest) => dest.weightInKg,
      mapFrom((src) => src.weight_kg ?? undefined),
    ),
    forMember(
      (dest) => dest.complexionCode,
      mapFrom((src) => src.complexion_code ?? undefined),
    ),
    forMember(
      (dest) => dest.buildCode,
      mapFrom((src) => src.build_code ?? undefined),
    ),
    forMember(
      (dest) => dest.hairColourCode,
      mapFrom((src) => src.hair_colour_code ?? undefined),
    ),
    forMember(
      (dest) => dest.hairLengthCode,
      mapFrom((src) => src.hair_length_code ?? undefined),
    ),
    forMember(
      (dest) => dest.hairColourOther,
      mapFrom((src) => src.hair_colour_other ?? undefined),
    ),
    forMember(
      (dest) => dest.eyeColourCode,
      mapFrom((src) => src.eye_colour_code ?? undefined),
    ),
    forMember(
      (dest) => dest.eyeColourOther,
      mapFrom((src) => src.eye_colour_other ?? undefined),
    ),
    forMember(
      (dest) => dest.facialHairStyleCodes,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.person_facial_hair_style_code ?? [],
          "person_facial_hair_style_code",
          "PersonFacialHairStyleCode",
        ),
      ),
    ),
  );
};
