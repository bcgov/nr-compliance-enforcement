import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { business } from "../../../../prisma/shared/generated/business";
import { BusinessDto } from "../../../common/party";
import { Alias } from "../../alias/dto/alias";
import { BusinessIdentifier } from "../../business_identifier/dto/business_identifier";
import { ContactMethod } from "../../contact_method/dto/contact_method";
import { Person } from "../../person/dto/person";

export class Business implements BusinessDto {
  businessGuid: string;
  partyGuid: string;
  name: string;
  aliases: Alias[];
  identifiers: BusinessIdentifier[];
  contactMethods: ContactMethod[];
  contactPeople: Person[];
}

export const mapPrismaBusinessToBusiness = (mapper: Mapper) => {
  createMap<business, Business>(
    mapper,
    "business",
    "Business",
    forMember(
      (dest) => dest.businessGuid,
      mapFrom((src) => src.business_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.aliases,
      mapWithArguments((src) => mapper.mapArray(src.alias ?? [], "alias", "Alias")),
    ),
    forMember(
      (dest) => dest.identifiers,
      mapWithArguments((src) =>
        mapper.mapArray(src.business_identifier ?? [], "business_identifier", "BusinessIdentifier"),
      ),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) => mapper.mapArray(src.contact_method ?? [], "contact_method", "ContactMethod")),
    ),
    forMember(
      (dest) => dest.contactPeople,
      mapWithArguments((src) =>
        mapper.mapArray(src.business_person_xref?.map((xref) => xref.person) ?? [], "person", "Person"),
      ),
    ),
  );
};
