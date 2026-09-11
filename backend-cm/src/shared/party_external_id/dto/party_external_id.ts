import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { party_external_id } from "prisma/shared/generated/party_external_id";

export class PartyExternalId {
  partyExternalIdGuid: string;
  partyGuid: string;
  externalIdCode: string;
  externalIdValue: string;
}

@InputType()
export class PartyExternalIdInput {
  @Field(() => String, { nullable: true })
  partyExternalIdGuid?: string;

  @Field(() => String)
  externalIdCode: string;

  @Field(() => String)
  externalIdValue: string;
}

// Distinct input type as shared parties currently have mandatory fields.  Could combine in future.
@InputType()
export class PartyExternalIdMatchInput {
  @Field(() => String)
  externalIdCode: string;

  @Field(() => String, { nullable: true })
  externalIdValue?: string;
}

export const mapPrismaPartyExternalIdToPartyExternalId = (mapper: Mapper) => {
  createMap<party_external_id, PartyExternalId>(
    mapper,
    "party_external_id",
    "PartyExternalId",
    forMember(
      (dest) => dest.partyExternalIdGuid,
      mapFrom((src) => src.party_external_id_guid),
    ),
    forMember(
      (dest) => dest.partyGuid,
      mapFrom((src) => src.party_guid),
    ),
    forMember(
      (dest) => dest.externalIdCode,
      mapFrom((src) => src.party_external_id_code),
    ),
    forMember(
      (dest) => dest.externalIdValue,
      mapFrom((src) => src.external_id_value),
    ),
  );
};
