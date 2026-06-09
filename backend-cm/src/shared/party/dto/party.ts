import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { party } from "../../../../prisma/shared/generated/party";
import { person } from "../../../../prisma/shared/generated/person";
import { business } from "../../../../prisma/shared/generated/business";
import { Person } from "../../person/dto/person";
import { Business } from "../../business/dto/business";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { PaginatedResult } from "../../../common/pagination.utility";
import { PageInfo } from "../../case_file/dto/case_file";
import { PartyDto } from "../../../common/party";
import { Address, AddressInput } from "../../address/dto/address";
import { ContactMethod } from "src/shared/contact_method/dto/contact_method";
import { Alias } from "src/shared/alias/dto/alias";

export class Party implements PartyDto {
  partyIdentifier: string;
  partyTypeCode: string;
  longDescription: string;
  shortDescription: string;
  createdDateTime: Date;
  updatedDateTime: Date;
  createdByUserGuid: string;
  person: Person;
  business: Business;
  addresses: [Address];
  contactMethods: [ContactMethod];
  aliases: [Alias];
}

@InputType()
export class PartyCreateInput {
  @Field(() => String)
  partyTypeCode: string;

  @Field(() => Person, { nullable: true })
  @IsOptional()
  person?: Person;

  @Field(() => Business, { nullable: true })
  @IsOptional()
  business?: Business;

  @Field(() => [AddressInput], { nullable: true })
  @IsOptional()
  addresses?: AddressInput[];

  @Field(() => [ContactMethod], { nullable: true })
  @IsOptional()
  contactMethods?: ContactMethod[];

  @Field(() => [Alias], { nullable: true })
  @IsOptional()
  aliases?: Alias[];
}

@InputType()
export class PartyUpdateInput {
  @Field(() => String)
  partyTypeCode: string;

  @Field(() => Person, { nullable: true })
  @IsOptional()
  person?: Person;

  @Field(() => Business, { nullable: true })
  @IsOptional()
  business?: Business;

  @Field(() => [AddressInput], { nullable: true })
  @IsOptional()
  addresses?: AddressInput[];

  @Field(() => [ContactMethod], { nullable: true })
  @IsOptional()
  contactMethods?: ContactMethod[];

  @Field(() => [Alias], { nullable: true })
  @IsOptional()
  aliases?: Alias[];
}

@InputType()
export class PartyFilters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  partyTypeCode?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortOrder?: string;
}

export const mapPrismaPartyToParty = (mapper: Mapper) => {
  createMap<party, Party>(
    mapper,
    "party",
    "Party",

    forMember(
      (dest) => dest.partyIdentifier,
      mapFrom((src) => src.party_guid),
    ),

    forMember(
      (dest) => dest.partyTypeCode,
      mapFrom((src) => src.party_type),
    ),

    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.party_type_code?.short_description),
    ),

    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.party_type_code?.long_description),
    ),

    forMember(
      (dest) => dest.createdDateTime,
      mapFrom((src) => src.create_utc_timestamp),
    ),

    forMember(
      (dest) => dest.updatedDateTime,
      mapFrom((src) => src.update_utc_timestamp),
    ),

    forMember(
      (dest) => dest.createdByUserGuid,
      mapFrom((src) => src.created_by_app_user_guid),
    ),

    forMember(
      (dest) => dest.person,
      mapFrom((src) => mapper.map<person, Person>(src.person, "person", "Person")),
    ),

    forMember(
      (dest) => dest.business,
      mapFrom((src) => mapper.map<business, Business>(src.business, "business", "Business")),
    ),

    forMember(
      (dest) => dest.addresses,
      mapWithArguments((src) => mapper.mapArray(src.address ?? [], "address", "Address")),
    ),

    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) => mapper.mapArray(src.contact_method ?? [], "contact_method", "ContactMethod")),
    ),

    forMember(
      (dest) => dest.aliases,
      mapWithArguments((src) => mapper.mapArray(src.alias ?? [], "alias", "Alias")),
    ),
  );
};

@ObjectType()
export class PartyResult implements PaginatedResult<Party> {
  @Field(() => [Party])
  items: Party[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
