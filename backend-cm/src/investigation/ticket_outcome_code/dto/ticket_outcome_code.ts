import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { ticket_outcome_code } from "../../../../prisma/investigation/generated/ticket_outcome_code";

export class TicketOutcomeCode {
  ticketOutcomeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTicketOutcomeCodeToTicketOutcomeCode = (mapper: Mapper) => {
  createMap<ticket_outcome_code, TicketOutcomeCode>(
    mapper,
    "ticket_outcome_code",
    "TicketOutcomeCode",
    forMember(
      (dest) => dest.ticketOutcomeCode,
      mapFrom((src) => src.ticket_outcome_code),
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
