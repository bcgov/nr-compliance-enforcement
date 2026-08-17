import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_alias } from "../../../../prisma/investigation/generated/investigation_alias";
import { Field, InputType } from "@nestjs/graphql";

export class InvestigationAlias {
  aliasGuid: string;
  name: string;
  isActive: boolean;
  aliasReference?: string;
}

@InputType()
export class CreateInvestigationAliasInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  aliasReference?: string;
}

@InputType()
export class UpdateInvestigationAliasInput {
  @Field(() => String, { nullable: true })
  aliasGuid?: string;

  @Field(() => String, { nullable: true })
  aliasReference?: string;

  @Field(() => String)
  name: string;
}

export const mapPrismaAliasToInvestigationAlias = (mapper: Mapper) => {
  createMap<investigation_alias, InvestigationAlias>(
    mapper,
    "investigation_alias",
    "InvestigationAlias",
    forMember(
      (dest) => dest.aliasGuid,
      mapFrom((src) => src.investigation_alias_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.aliasReference,
      mapFrom((src) => src.alias_guid_ref),
    ),
  );
};
