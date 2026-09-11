import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { ticket_type_code } from "../../../../prisma/investigation/generated/ticket_type_code";

export class TicketTypeCode {
  ticketTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTicketTypeCodeToTicketTypeCode = (mapper: Mapper) => {
  createMap<ticket_type_code, TicketTypeCode>(
    mapper,
    "ticket_type_code",
    "TicketTypeCode",
    forMember(
      (dest) => dest.ticketTypeCode,
      mapFrom((src) => src.ticket_type_code),
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
