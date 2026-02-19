import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { alias } from "prisma/shared/generated/alias";

export class Alias {
  aliasGuid: string;
  businessGuid: string;
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
      (dest) => dest.businessGuid,
      mapFrom((src) => src.business_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
  );
};
