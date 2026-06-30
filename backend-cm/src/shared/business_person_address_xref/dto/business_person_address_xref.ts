import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { business_person_address_xref } from "prisma/shared/generated/business_person_address_xref";
import { Address } from "src/shared/address/dto/address";
import { BusinessPersonXref } from "src/shared/business_person_xref/dto/business_person_xref";

export class BusinessPersonAddressXref {
  businessPersonAddressXrefGuid: string;
  businessPerson: BusinessPersonXref;
  address: Address;
}

export const mapPrismaBusinessPersonAddressXrefToBusinessPersonAddressXref = (mapper: Mapper) => {
  createMap<business_person_address_xref, BusinessPersonAddressXref>(
    mapper,
    "business_person_address_xref",
    "BusinessPersonAddressXref",
    forMember(
      (dest) => dest.businessPersonAddressXrefGuid,
      mapFrom((src) => src.business_person_address_xref_guid),
    ),
    forMember(
      (dest) => dest.businessPerson,
      mapWithArguments((src) => mapper.map(src.business_person_xref, "business_person_xref", "BusinessPersonXref")),
    ),
    forMember(
      (dest) => dest.address,
      mapWithArguments((src) => mapper.map(src.address, "address", "Address")),
    ),
  );
};
