import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { complexion_code } from "prisma/shared/generated/complexion_code";

export class ComplexionCode {
  complexionCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaComplexionCodeToComplexionCode = (mapper: Mapper) => {
  createMap<complexion_code, ComplexionCode>(
    mapper,
    "complexion_code",
    "ComplexionCode",
    forMember(
      (dest) => dest.complexionCode,
      mapFrom((src) => src.complexion_code),
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
