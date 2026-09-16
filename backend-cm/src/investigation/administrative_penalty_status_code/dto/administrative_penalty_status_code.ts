import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { administrative_penalty_status_code } from "../../../../prisma/investigation/generated/administrative_penalty_status_code";

export class AdministrativePenaltyStatusCode {
  administrativePenaltyStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaAdministrativePenaltyStatusCodeToAdministrativePenaltyStatusCode = (mapper: Mapper) => {
  createMap<administrative_penalty_status_code, AdministrativePenaltyStatusCode>(
    mapper,
    "administrative_penalty_status_code",
    "AdministrativePenaltyStatusCode",
    forMember(
      (dest) => dest.administrativePenaltyStatusCode,
      mapFrom((src) => src.administrative_penalty_status_code),
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
