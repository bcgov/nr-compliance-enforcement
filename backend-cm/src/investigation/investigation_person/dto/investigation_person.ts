import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { investigation_person } from "../../../../prisma/investigation/generated/investigation_person";
import { Field, InputType } from "@nestjs/graphql";
import { PersonDto } from "../../../common/party";
import {
  InvestigationPersonFacialHairStyleCodeRef,
  InvestigationPersonFacialHairStyleCodeRefInput,
} from "src/investigation/investigation_person_facial_hair_style_code_ref/dto/InvestigationPersonFacialHairStyleCodeRef";

export class InvestigationPerson implements PersonDto {
  personGuid: string;
  partyGuid: string;
  personReference?: string;
  firstName: string;
  middleNames?: string;
  lastName: string;
  isActive: boolean;
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
  facialHairIndicator?: boolean;
  facialHairStyleCodes?: [InvestigationPersonFacialHairStyleCodeRef];
  additionalHairDescriptors?: string;
  tattooIndicator?: boolean;
  tattooDescription?: string;
  additionalDescriptors?: string;
  comments?: string;
  boloIndicator?: boolean;
}

@InputType()
export class CreateInvestigationPersonInput {
  @Field(() => String, { nullable: true })
  personReference?: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  middleNames?: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  approximateAgeCode?: string;

  @Field(() => String, { nullable: true })
  driversLicenseNumber?: string;

  @Field(() => String, { nullable: true })
  driversLicenseClass?: string;

  @Field(() => String, { nullable: true })
  driversLicenseCountryCode?: string;

  @Field(() => String, { nullable: true })
  driversLicenseCountrySubdivisionCode?: string;

  @Field(() => String, { nullable: true })
  genderCode?: string;

  @Field(() => String, { nullable: true })
  heightInCm?: string;

  @Field(() => String, { nullable: true })
  weightInKg?: string;

  @Field(() => String, { nullable: true })
  complexionCode?: string;

  @Field(() => String, { nullable: true })
  buildCode?: string;

  @Field(() => String, { nullable: true })
  hairColourCode?: string;

  @Field(() => String, { nullable: true })
  hairLengthCode?: string;

  @Field(() => String, { nullable: true })
  hairColourOther?: string;

  @Field(() => String, { nullable: true })
  eyeColourCode?: string;

  @Field(() => String, { nullable: true })
  eyeColourOther?: string;

  @Field(() => Boolean, { nullable: true })
  facialHairIndicator?: boolean;

  @Field(() => [InvestigationPersonFacialHairStyleCodeRefInput], { nullable: true })
  facialHairStyleCodes?: InvestigationPersonFacialHairStyleCodeRefInput[];

  @Field(() => String, { nullable: true })
  additionalHairDescriptors?: string;

  @Field(() => Boolean, { nullable: true })
  tattooIndicator?: boolean;

  @Field(() => String, { nullable: true })
  tattooDescription?: string;

  @Field(() => String, { nullable: true })
  additionalDescriptors?: string;

  @Field(() => String, { nullable: true })
  comments?: string;

  @Field(() => Boolean, { nullable: true })
  boloIndicator?: boolean;
}

@InputType()
export class UpdateInvestigationPersonInput extends CreateInvestigationPersonInput {
  @Field(() => String)
  investigationPersonGuid: string;
}

export const mapPrismaPersonToInvestigationPerson = (mapper: Mapper) => {
  createMap<investigation_person, InvestigationPerson>(
    mapper,
    "investigation_person",
    "InvestigationPerson",
    forMember(
      (dest) => dest.personGuid,
      mapFrom((src) => src.investigation_person_guid),
    ),
    forMember(
      (dest) => dest.partyGuid,
      mapFrom((src) => src.investigation_party_guid),
    ),
    forMember(
      (dest) => dest.personReference,
      mapFrom((src) => src.person_guid_ref),
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
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.dateOfBirth,
      mapFrom((src) => src.date_of_birth),
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
      mapFrom((src) => src.drivers_license_country_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.driversLicenseCountrySubdivisionCode,
      mapFrom((src) => src.drivers_license_country_subdivision_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.genderCode,
      mapFrom((src) => src.gender_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.approximateAgeCode,
      mapFrom((src) => src.approximate_age_code_ref ?? undefined),
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
      mapFrom((src) => src.complexion_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.buildCode,
      mapFrom((src) => src.build_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.hairColourCode,
      mapFrom((src) => src.hair_colour_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.hairLengthCode,
      mapFrom((src) => src.hair_length_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.hairColourOther,
      mapFrom((src) => src.hair_colour_other ?? undefined),
    ),
    forMember(
      (dest) => dest.eyeColourCode,
      mapFrom((src) => src.eye_colour_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.eyeColourOther,
      mapFrom((src) => src.eye_colour_other ?? undefined),
    ),
    forMember(
      (dest) => dest.facialHairIndicator,
      mapFrom((src) => src.facial_hair_ind ?? undefined),
    ),
    forMember(
      (dest) => dest.additionalHairDescriptors,
      mapFrom((src) => src.additional_hair_descriptors ?? undefined),
    ),
    forMember(
      (dest) => dest.facialHairStyleCodes,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.investigation_person_facial_hair_style_code_ref ?? [],
          "investigation_person_facial_hair_style_code_ref",
          "InvestigationPersonFacialHairStyleCodeRef",
        ),
      ),
    ),
    forMember(
      (dest) => dest.tattooIndicator,
      mapFrom((src) => src.tattoo_ind ?? undefined),
    ),
    forMember(
      (dest) => dest.tattooDescription,
      mapFrom((src) => src.tattoo_description ?? undefined),
    ),
    forMember(
      (dest) => dest.additionalDescriptors,
      mapFrom((src) => src.additional_descriptors ?? undefined),
    ),
    forMember(
      (dest) => dest.comments,
      mapFrom((src) => src.comments ?? undefined),
    ),
    forMember(
      (dest) => dest.boloIndicator,
      mapFrom((src) => src.bolo_ind ?? undefined),
    ),
  );
};
