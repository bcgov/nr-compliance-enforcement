import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { ticket } from "../../../../prisma/investigation/generated/ticket";

export class Ticket {
  ticketIdentifier: string;
  enforcementActionIdentifier: string;
  ticketOutcomeCode: string;
  ticketAmount: number;
  ticketNumber: string;
  activeIndicator: boolean;
  paidDate?: Date;
}

export const mapPrismaTicketToTicket = (mapper: Mapper) => {
  createMap<ticket, Ticket>(
    mapper,
    "ticket",
    "Ticket",
    forMember(
      (dest) => dest.ticketIdentifier,
      mapFrom((src) => src.ticket_guid),
    ),
    forMember(
      (dest) => dest.enforcementActionIdentifier,
      mapFrom((src) => src.enforcement_action_guid),
    ),
    forMember(
      (dest) => dest.ticketOutcomeCode,
      mapFrom((src) => src.ticket_outcome_code),
    ),
    forMember(
      (dest) => dest.ticketAmount,
      mapFrom((src) => src.ticket_amount),
    ),
    forMember(
      (dest) => dest.ticketNumber,
      mapFrom((src) => src.ticket_number),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.paidDate,
      mapFrom((src) => src.paid_date),
    ),
  );
};
