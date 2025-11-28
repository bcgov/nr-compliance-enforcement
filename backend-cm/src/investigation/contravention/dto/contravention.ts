import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { contravention } from "../../../../prisma/investigation/generated/contravention";
import { Field, InputType } from "@nestjs/graphql";

export class Contravention {
  contraventionIdentifier: string;
  investigationIdentifier: string;
  legislationIdentifierRef: string;
  isActive: boolean;
}

@InputType()
export class CreateContraventionInput {
  @Field(() => String)
  investigationGuid: string;

  @Field(() => String)
  investigationPartyGuid: string[];

  @Field(() => String)
  legislationReference: string;
}

export const mapPrismaContreventionToContravention = (mapper: Mapper) => {
  createMap<contravention, Contravention>(
    mapper,
    "contravention",
    "Contravention",
    forMember(
      (dest) => dest.contraventionIdentifier,
      mapFrom((src) => src.contravention_guid),
    ),
    forMember(
      (dest) => dest.investigationIdentifier,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.legislationIdentifierRef,
      mapFrom((src) => src.legislation_guid_ref),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
  );
};
