import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { event_entity_type_code } from "../../../../prisma/shared/generated/event_entity_type_code";

export class EventEntityTypeCode {
  eventEntityTypeCode: string;
  shortDescription: string;
  longDescription?: string;
  displayOrder?: number;
  activeInd: boolean;
}

export const mapPrismaEventEntityTypeCodeToEventEntityTypeCode = (mapper: Mapper) => {
  createMap<event_entity_type_code, EventEntityTypeCode>(
    mapper,
    "event_entity_type_code",
    "EventEntityTypeCode",
    forMember(
      (dest) => dest.eventEntityTypeCode,
      mapFrom((src) => src.event_entity_type_code),
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
      (dest) => dest.activeInd,
      mapFrom((src) => src.active_ind),
    ),
  );
};
