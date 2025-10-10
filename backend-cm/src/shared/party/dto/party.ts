import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
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

export class Party implements PartyDto {
  partyIdentifier: string;
  partyTypeCode: string;
  longDescription: string;
  shortDescription: string;
  createdDateTime: Date;
  person: Person;
  business: Business;
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
      mapFrom((src) => src.party_type_code.short_description),
    ),

    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.party_type_code.long_description),
    ),

    forMember(
      (dest) => dest.createdDateTime,
      mapFrom((src) => src.create_utc_timestamp),
    ),

    forMember(
      (dest) => dest.person,
      mapFrom((src) => mapper.map<person, Person>(src.person, "person", "Person")),
    ),

    forMember(
      (dest) => dest.business,
      mapFrom((src) => mapper.map<business, Business>(src.business, "business", "Business")),
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
