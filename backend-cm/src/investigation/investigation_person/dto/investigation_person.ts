import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_person } from "../../../../prisma/investigation/generated/investigation_person";
import { Field, InputType } from "@nestjs/graphql";
import { PersonDto } from "../../../common/party";
import {
  CreateInvestigationContactMethodInput,
  InvestigationContactMethod,
  UpdateInvestigationContactMethodInput,
} from "../../investigation_contact_method/dto/investigation_contact_method";

export class InvestigationPerson implements PersonDto {
  personGuid: string;
  partyGuid: string;
  personReference?: string;
  firstName: string;
  middleName?: string;
  middleName2?: string;
  lastName: string;
  isActive: boolean;
  dateOfBirth?: Date;
  driversLicenseNumber?: string;
  driversLicenseJurisdiction?: string;
  sexCode?: string;
  contactMethods?: InvestigationContactMethod[];
}

@InputType()
export class CreateInvestigationPersonInput {
  @Field(() => String, { nullable: true })
  personReference?: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => String, { nullable: true })
  middleName2?: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  driversLicenseNumber?: string;

  @Field(() => String, { nullable: true })
  driversLicenseJurisdiction?: string;

  @Field(() => String, { nullable: true })
  sexCode?: string;

  @Field(() => [CreateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: CreateInvestigationContactMethodInput[];
}

@InputType()
export class UpdateInvestigationPersonInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  middleName?: string;

  @Field(() => String, { nullable: true })
  middleName2?: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  driversLicenseNumber?: string;

  @Field(() => String, { nullable: true })
  driversLicenseJurisdiction?: string;

  @Field(() => String, { nullable: true })
  sexCode?: string;

  @Field(() => [UpdateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: UpdateInvestigationContactMethodInput[];
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
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.dateOfBirth,
      mapFrom((src) => src.date_of_birth),
    ),
    forMember(
      (dest) => dest.driversLicenseNumber,
      mapFrom((src) => src.drivers_license_number),
    ),
    forMember(
      (dest) => dest.driversLicenseJurisdiction,
      mapFrom((src) => src.drivers_license_jurisdiction),
    ),
    forMember(
      (dest) => dest.sexCode,
      mapFrom((src) => src.sex_code_ref),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapFrom((src) =>
        mapper.mapArray(
          src.investigation_contact_method ?? [],
          "investigation_contact_method",
          "InvestigationContactMethod",
        ),
      ),
    ),
  );
};
