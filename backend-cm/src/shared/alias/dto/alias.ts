import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Field } from "@nestjs/graphql";
import { alias } from "prisma/shared/generated/alias";

export class Alias {
  aliasGuid: string;
  name: string;
}

export class AliasInput {
  @Field(() => String)
  name: string;
}

export class AliasUpdateInput {
  @Field(() => String)
  aliasGuid: string;

  @Field(() => String)
  name: string;
}

export const mapPrismaAliasToAlias = (mapper: Mapper) => {
  createMap<alias, Alias>(
    mapper,
    "alias",
    "Alias",
    forMember(
      (dest) => dest.aliasGuid,
      mapFrom((src) => src.alias_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
  );
};
