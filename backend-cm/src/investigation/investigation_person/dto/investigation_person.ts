import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_person } from "../../../../prisma/investigation/generated/investigation_person";
import { Field, InputType } from "@nestjs/graphql";

export class InvestigationPerson {
  investigationPersonGuid: string;
  investigationPartyGuid: string;
  personReference?: string;
  firstName: string;
  middleName?: string;
  middleName2?: string;
  lastName: string;
}

@InputType()
export class CreateInvestigationPersonInput {
  @Field(() => String)
  personReference: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  middleName: string;

  @Field(() => String)
  middleName2: string;

  @Field(() => String)
  lastName: string;
}

export const mapPrismaPersonToInvestigationPerson = (mapper: Mapper) => {
  createMap<investigation_person, InvestigationPerson>(
    mapper,
    "investigation_person",
    "InvestigationPerson",
    forMember(
      (dest) => dest.investigationPersonGuid,
      mapFrom((src) => src.investigation_person_guid),
    ),
    forMember(
      (dest) => dest.investigationPartyGuid,
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
  );
};
