import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { person_facial_hair_style_code } from "prisma/shared/generated/person_facial_hair_style_code";

export class PersonFacialHairStyleCode {
  personFacialStyleHairCodeGuid: string;
  personGuid: string;
  facialHairStyleCode: string;
  activeIndicator: boolean;
}

@InputType()
export class PersonFacialHairStyleCodeInput {
  @Field(() => String)
  personFacialStyleHairCodeGuid: string;

  @Field(() => String)
  personGuid: string;

  @Field(() => String)
  facialHairStyleCode: string;

  @Field(() => String)
  activeIndicator: string;
}

export const mapPrismaPersonFacialHairStyleCodeToPersonFacialHairStyleCode = (mapper: Mapper) => {
  createMap<person_facial_hair_style_code, PersonFacialHairStyleCode>(
    mapper,
    "person_facial_hair_style_code",
    "PersonFacialHairStyleCode",
    forMember(
      (dest) => dest.personFacialStyleHairCodeGuid,
      mapFrom((src) => src.person_facial_hair_style_code_guid),
    ),
    forMember(
      (dest) => dest.personGuid,
      mapFrom((src) => src.person_guid),
    ),
    forMember(
      (dest) => dest.facialHairStyleCode,
      mapFrom((src) => src.facial_hair_style_code),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
