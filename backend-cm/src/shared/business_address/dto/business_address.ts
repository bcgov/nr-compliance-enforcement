import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { business_address } from "prisma/shared/generated/business_address";

export class BusinessAddress {
  businessAddressGuid: string;
  businessGuid: string;
  addressName: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
}

export const mapPrismaBusinessAddressToBusinessAddress = (mapper: Mapper) => {
  createMap<business_address, BusinessAddress>(
    mapper,
    "business_address",
    "BusinessAddress",
    forMember(
      (dest) => dest.businessAddressGuid,
      mapFrom((src) => src.business_address_guid),
    ),
    forMember(
      (dest) => dest.businessGuid,
      mapFrom((src) => src.business_guid),
    ),
    forMember(
      (dest) => dest.addressName,
      mapFrom((src) => src.address_name),
    ),
    forMember(
      (dest) => dest.address,
      mapFrom((src) => src.address ?? undefined),
    ),
    forMember(
      (dest) => dest.city,
      mapFrom((src) => src.city ?? undefined),
    ),
    forMember(
      (dest) => dest.province,
      mapFrom((src) => src.country_subdivision_code ?? undefined),
    ),
    forMember(
      (dest) => dest.postalCode,
      mapFrom((src) => src.postal_code ?? undefined),
    ),
    forMember(
      (dest) => dest.country,
      mapFrom((src) => src.country_code ?? undefined),
    ),
    forMember(
      (dest) => dest.isPrimary,
      mapFrom((src) => src.is_primary ?? false),
    ),
  );
};
