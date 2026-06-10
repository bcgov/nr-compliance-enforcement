import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { investigation_person_facial_hair_style_code_ref } from "prisma/investigation/generated/investigation_person_facial_hair_style_code_ref";

export class InvestigationPersonFacialHairStyleCodeRef {
  investionPersonFacialStyleHairCodeRefGuid: string;
  investigationPersonGuid: string;
  facialHairStyleCodeRef: string;
  activeIndicator: boolean;
}

@InputType()
export class InvestigationPersonFacialHairStyleCodeRefInput {
  @Field(() => String)
  investionPersonFacialStyleHairCodeRefGuid: string;

  @Field(() => String)
  investigationPersonGuid: string;

  @Field(() => String)
  facialHairStyleCodeRef: string;

  @Field(() => String)
  activeIndicator: string;
}

export const mapPrismaPersonFacialHairStyleCodeToPersonFacialHairStyleCode = (mapper: Mapper) => {
  createMap<investigation_person_facial_hair_style_code_ref, InvestigationPersonFacialHairStyleCodeRef>(
    mapper,
    "investigation_person_facial_hair_style_code_ref",
    "InvestigationPersonFacialHairStyleCodeRef",
    forMember(
      (dest) => dest.investionPersonFacialStyleHairCodeRefGuid,
      mapFrom((src) => src.investigation_person_facial_hair_style_code_ref_guid),
    ),
    forMember(
      (dest) => dest.investigationPersonGuid,
      mapFrom((src) => src.investigation_person_guid),
    ),
    forMember(
      (dest) => dest.facialHairStyleCodeRef,
      mapFrom((src) => src.facial_hair_style_code_ref),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
