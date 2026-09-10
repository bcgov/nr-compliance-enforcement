import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_party_external_id } from "../../../../prisma/investigation/generated/investigation_party_external_id";
import { Field, InputType } from "@nestjs/graphql";

export class InvestigationPartyExternalId {
  partyExternalIdGuid: string;
  externalIdCode: string;
  externalIdValue: string;
  isActive: boolean;
  partyExternalIdReference?: string;
}

@InputType()
export class CreateInvestigationPartyExternalIdInput {
  @Field(() => String)
  externalIdCode: string;

  @Field(() => String)
  externalIdValue: string;

  @Field(() => String, { nullable: true })
  partyExternalIdReference?: string;
}

@InputType()
export class UpdateInvestigationPartyExternalIdInput {
  @Field(() => String, { nullable: true })
  partyExternalIdGuid?: string;

  @Field(() => String, { nullable: true })
  partyExternalIdReference?: string;

  @Field(() => String)
  externalIdCode: string;

  @Field(() => String)
  externalIdValue: string;
}

export const mapPrismaInvestigationPartyExternalIdToInvestigationPartyExternalId = (mapper: Mapper) => {
  createMap<investigation_party_external_id, InvestigationPartyExternalId>(
    mapper,
    "investigation_party_external_id",
    "InvestigationPartyExternalId",
    forMember(
      (dest) => dest.partyExternalIdGuid,
      mapFrom((src) => src.investigation_party_external_id_guid),
    ),
    forMember(
      (dest) => dest.externalIdCode,
      mapFrom((src) => src.party_external_id_code_ref),
    ),
    forMember(
      (dest) => dest.externalIdValue,
      mapFrom((src) => src.external_id_value),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.partyExternalIdReference,
      mapFrom((src) => src.party_external_id_guid_ref),
    ),
  );
};
