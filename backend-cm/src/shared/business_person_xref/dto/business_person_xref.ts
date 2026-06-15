import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { business_person_xref } from "prisma/shared/generated/business_person_xref";
import { Business } from "src/shared/business/dto/business";
import { ContactMethod } from "src/shared/contact_method/dto/contact_method";
import { Person } from "src/shared/person/dto/person";

export class BusinessPersonXref {
  businessPersonXrefGuid: string;
  business: Business;
  person: Person;
  contactMethods?: [ContactMethod]; // These are at the party level for people so need to be passed in parallel
}

export const mapPrismaBusinessPersonXrefToBusinessPersonXref = (mapper: Mapper) => {
  createMap<business_person_xref, BusinessPersonXref>(
    mapper,
    "business_person_xref",
    "BusinessPersonXref",
    forMember(
      (dest) => dest.businessPersonXrefGuid,
      mapFrom((src) => src.business_person_xref_guid),
    ),
    forMember(
      (dest) => dest.business,
      mapWithArguments((src) => mapper.map(src.business, "business", "Business")),
    ),
    forMember(
      (dest) => dest.person,
      mapWithArguments((src) => mapper.map(src.person, "person", "Person")),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) =>
        mapper.mapArray(src.person?.party?.contact_method ?? [], "contact_method", "ContactMethod"),
      ),
    ),
  );
};
