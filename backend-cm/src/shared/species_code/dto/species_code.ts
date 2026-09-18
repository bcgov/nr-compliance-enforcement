import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { species_code } from "../../../../prisma/shared/generated/species_code";

export class SpeciesCode {
  speciesCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  largeCarnivoreIndicator: boolean;
}

export const mapPrismaSpeciesCodeToSpeciesCode = (mapper: Mapper) => {
  createMap<species_code, SpeciesCode>(
    mapper,
    "species_code",
    "SpeciesCode",
    forMember(
      (dest) => dest.speciesCode,
      mapFrom((src) => src.species_code),
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
    forMember(
      (dest) => dest.largeCarnivoreIndicator,
      mapFrom((src) => src.large_carnivore_ind),
    ),
  );
};
