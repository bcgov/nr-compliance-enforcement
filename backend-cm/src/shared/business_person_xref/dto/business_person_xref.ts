import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { business_person_xref } from "prisma/shared/generated/business_person_xref";
import { Business } from "src/shared/business/dto/business";
import { Person } from "src/shared/person/dto/person";

export class BusinessPersonXref {
  businessPersonXrefGuid: string;
  business: Business;
  person: Person;
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
  );
};
