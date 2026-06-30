import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { investigation_business_person_xref } from "prisma/investigation/generated/investigation_business_person_xref";
import { InvestigationBusinessPersonAddressXref } from "src/investigation/investigation_business_person_address_xref/dto/investigation_business_person_address_xref";
import { InvestigationContactMethod } from "src/investigation/investigation_contact_method/dto/investigation_contact_method";
import { Business } from "src/shared/business/dto/business";
import { Person } from "src/shared/person/dto/person";

export class InvestigationBusinessPersonXref {
  businessPersonXrefGuid: string;
  title: string;
  business: Business;
  person: Person;
  contactMethods?: [InvestigationContactMethod]; // These are at the party level for people so need to be passed in parallel
  associatedAddresses?: [InvestigationBusinessPersonAddressXref];
}

export const mapPrismaInvestigationBusinessPersonXrefToInvestigationBusinessPersonXref = (mapper: Mapper) => {
  createMap<investigation_business_person_xref, InvestigationBusinessPersonXref>(
    mapper,
    "investigation_business_person_xref",
    "InvestigationBusinessPersonXref",
    forMember(
      (dest) => dest.businessPersonXrefGuid,
      mapFrom((src) => src.investigation_business_person_xref_guid),
    ),
    forMember(
      (dest) => dest.title,
      mapFrom((src) => src.title_role),
    ),
    forMember(
      (dest) => dest.business,
      mapWithArguments((src) =>
        mapper.map(src.investigation_business, "investigation_business", "InvestigationBusiness"),
      ),
    ),
    forMember(
      (dest) => dest.person,
      mapWithArguments((src) => mapper.map(src.investigation_person, "investigation_person", "InvestigationPerson")),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.investigation_person?.investigation_party?.investigation_contact_method ?? [],
          "investigation_contact_method",
          "InvestigationContactMethod",
        ),
      ),
    ),
    forMember(
      (dest) => dest.associatedAddresses,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.investigation_business_person_address_xref ?? [],
          "investigation_business_person_address_xref",
          "InvestigationBusinessPersonAddressXref",
        ),
      ),
    ),
  );
};
