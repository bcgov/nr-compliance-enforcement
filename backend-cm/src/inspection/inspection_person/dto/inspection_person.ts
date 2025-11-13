import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { inspection_person } from "../../../../prisma/inspection/generated/inspection_person";
import { Field, InputType } from "@nestjs/graphql";
import { PersonDto } from "../../../common/party";

export class InspectionPerson implements PersonDto {
  personGuid: string;
  partyGuid: string;
  personReference?: string;
  firstName: string;
  middleName?: string;
  middleName2?: string;
  lastName: string;
  isActive: boolean;
}

@InputType()
export class CreateInspectionPersonInput {
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

export const mapPrismaPersonToInspectionPerson = (mapper: Mapper) => {
  createMap<inspection_person, InspectionPerson>(
    mapper,
    "inspection_person",
    "InspectionPerson",
    forMember(
      (dest) => dest.personGuid,
      mapFrom((src) => src.inspection_person_guid),
    ),
    forMember(
      (dest) => dest.partyGuid,
      mapFrom((src) => src.inspection_party_guid),
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
  );
};
