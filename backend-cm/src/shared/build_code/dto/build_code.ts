import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { build_code } from "prisma/shared/generated/build_code";

export class BuildCode {
  buildCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaBuildCodeToBuildCode = (mapper: Mapper) => {
  createMap<build_code, BuildCode>(
    mapper,
    "build_code",
    "BuildCode",
    forMember(
      (dest) => dest.buildCode,
      mapFrom((src) => src.build_code),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
