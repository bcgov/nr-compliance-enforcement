import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { event_verb_type_code } from "../../../../prisma/shared/generated/event_verb_type_code";

export class EventVerbTypeCode {
  eventVerbTypeCode: string;
  shortDescription: string;
  longDescription?: string;
  displayOrder?: number;
  activeInd: boolean;
}

export const mapPrismaEventVerbTypeCodeToEventVerbTypeCode = (mapper: Mapper) => {
  createMap<event_verb_type_code, EventVerbTypeCode>(
    mapper,
    "event_verb_type_code",
    "EventVerbTypeCode",
    forMember(
      (dest) => dest.eventVerbTypeCode,
      mapFrom((src) => src.event_verb_type_code),
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
