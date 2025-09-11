import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { inspection_status_code } from "../../../../prisma/inspection/generated/inspection_status_code";

export class InspectionStatusCode {
  inspectionStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaInspectionStatusCodeToInspectionStatusCode = (mapper: Mapper) => {
  createMap<inspection_status_code, InspectionStatusCode>(
    mapper,
    "inspection_status_code",
    "InspectionStatusCode",
    forMember(
      (dest) => dest.inspectionStatusCode,
      mapFrom((src) => src.inspection_status_code),
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
