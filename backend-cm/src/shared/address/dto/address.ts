import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { address } from "prisma/shared/generated/address";
import { ContactMethod, ContactMethodInput } from "src/shared/contact_method/dto/contact_method";

export class Address {
  addressGuid: string;
  partyGuid: string;
  addressName: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
  displayInInvestigation?: boolean;
  contactMethods: [ContactMethod];
}

@InputType()
export class AddressInput {
  @Field(() => String)
  addressGuid: string;

  @Field(() => String)
  partyGuid: string;

  @Field(() => String)
  addressName: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  province?: string;

  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => Boolean, { nullable: true })
  isPrimary?: boolean;

  @Field(() => Boolean, { nullable: true })
  displayInInvestigation?: boolean;

  @Field(() => [ContactMethodInput], { nullable: true })
  contactMethods?: ContactMethodInput[];
}

export const mapPrismaAddressToAddress = (mapper: Mapper) => {
  createMap<address, Address>(
    mapper,
    "address",
    "Address",
    forMember(
      (dest) => dest.addressGuid,
      mapFrom((src) => src.address_guid),
    ),
    forMember(
      (dest) => dest.partyGuid,
      mapFrom((src) => src.party_guid),
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
    forMember(
      (dest) => dest.displayInInvestigation,
      mapFrom((src) => src.display_in_investigation_ind ?? undefined),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) => mapper.mapArray(src.contact_method ?? [], "contact_method", "ContactMethod")),
    ),
  );
};
