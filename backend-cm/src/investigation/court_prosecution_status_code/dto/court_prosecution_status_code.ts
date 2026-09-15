import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { court_prosecution_status_code } from "../../../../prisma/investigation/generated/court_prosecution_status_code";

export class CourtProsecutionStatusCode {
  courtProsecutionStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaCourtProsecutionStatusCodeToCourtProsecutionStatusCode = (mapper: Mapper) => {
  createMap<court_prosecution_status_code, CourtProsecutionStatusCode>(
    mapper,
    "court_prosecution_status_code",
    "CourtProsecutionStatusCode",
    forMember(
      (dest) => dest.courtProsecutionStatusCode,
      mapFrom((src) => src.court_prosecution_status_code),
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
