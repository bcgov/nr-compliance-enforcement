import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { business } from "../../../../prisma/shared/generated/business";
import { BusinessDto } from "../../../common/party";
import { BusinessIdentifier } from "../../business_identifier/dto/business_identifier";
import { BusinessPersonXref } from "src/shared/business_person_xref/dto/business_person_xref";

export class Business implements BusinessDto {
  businessGuid: string;
  partyGuid: string;
  name: string;
  identifiers: BusinessIdentifier[];
  contactPeople: BusinessPersonXref[];
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
      (dest) => dest.identifiers,
      mapWithArguments((src) =>
        mapper.mapArray(src.business_identifier ?? [], "business_identifier", "BusinessIdentifier"),
      ),
    ),
    forMember(
      (dest) => dest.contactPeople,
      mapWithArguments((src) =>
        mapper.mapArray(src.business_person_xref ?? [], "business_person_xref", "BusinessPersonXref"),
      ),
    ),
  );
};
