import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { investigation_address } from "prisma/investigation/generated/investigation_address";

export class InvestigationAddress {
  addressGuid: string;
  addressName: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
}

@InputType()
export class CreateInvestigationAddressInput {
  @Field(() => String, { nullable: true })
  addressGuid?: string;

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
}

export const mapPrismaAddressToInvestigationAddress = (mapper: Mapper) => {
  createMap<investigation_address, InvestigationAddress>(
    mapper,
    "investigation_address",
    "InvestigationAddress",
    forMember(
      (dest) => dest.addressGuid,
      mapFrom((src) => src.investigation_address_guid),
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
      mapFrom((src) => src.country_subdivision_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.postalCode,
      mapFrom((src) => src.postal_code ?? undefined),
    ),
    forMember(
      (dest) => dest.country,
      mapFrom((src) => src.country_code_ref ?? undefined),
    ),
    forMember(
      (dest) => dest.isPrimary,
      mapFrom((src) => src.is_primary ?? false),
    ),
  );
};
