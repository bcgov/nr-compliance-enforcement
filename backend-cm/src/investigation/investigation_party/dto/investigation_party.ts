import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import {
  CreateInvestigationBusinessInput,
  InvestigationBusiness,
  UpdateInvestigationBusinessInput,
} from "../../investigation_business/dto/investigation_business";
import {
  CreateInvestigationPersonInput,
  InvestigationPerson,
  UpdateInvestigationPersonInput,
} from "../../investigation_person/dto/investigation_person";
import { investigation_party } from "../../../../prisma/investigation/generated/investigation_party";
import { Field, InputType } from "@nestjs/graphql";
import { PartyDto } from "../../../common/party";
import { EnforcementAction } from "src/investigation/enforcement_action/dto/enforcement_action";
import {
  CreateInvestigationContactMethodInput,
  InvestigationContactMethod,
  UpdateInvestigationContactMethodInput,
} from "src/investigation/investigation_contact_method/dto/investigation_contact_method";
import {
  CreateInvestigationAliasInput,
  InvestigationAlias,
  UpdateInvestigationAliasInput,
} from "src/investigation/investigation_alias/dto/investigation_alias";
import {
  CreateInvestigationAddressInput,
  InvestigationAddress,
} from "src/investigation/investigation_address/dto/investigation_address";
import {
  CreateInvestigationAttachmentReferenceInput,
  InvestigationAttachmentReference,
} from "src/investigation/investigation_attachment_reference/dto/investigation_attachment_reference";

export class InvestigationParty implements PartyDto {
  partyIdentifier: string;
  partyTypeCode: string;
  person?: InvestigationPerson;
  business?: InvestigationBusiness;
  isActive: boolean;
  investigationGuid: string;
  partyReference?: string;
  partyAssociationRole?: string;
  enforcementActions?: EnforcementAction[];
  contactMethods?: InvestigationContactMethod[];
  aliases?: InvestigationAlias[];
  addresses?: InvestigationAddress[];
  attachmentReferences?: InvestigationAttachmentReference[];
}

@InputType()
export class CreateInvestigationPartyInput {
  @Field(() => String)
  partyTypeCode: string;

  @Field(() => String)
  partyReference?: string;

  @Field(() => CreateInvestigationPersonInput, { nullable: true })
  person?: CreateInvestigationPersonInput;

  @Field(() => CreateInvestigationBusinessInput, { nullable: true })
  business?: CreateInvestigationBusinessInput;

  @Field(() => String)
  partyAssociationRole: string;

  @Field(() => [CreateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: CreateInvestigationContactMethodInput[];

  @Field(() => [CreateInvestigationAliasInput], { nullable: true })
  aliases?: CreateInvestigationAliasInput[];

  @Field(() => [CreateInvestigationAddressInput], { nullable: true })
  addresses?: CreateInvestigationAddressInput[];

  @Field(() => [CreateInvestigationAttachmentReferenceInput], { nullable: true })
  attachmentReferences?: CreateInvestigationAttachmentReferenceInput[];
}

@InputType()
export class UpdateInvestigationPartyInput {
  @Field(() => String)
  partyIdentifier: string;

  @Field(() => String)
  partyAssociationRole: string;

  @Field(() => UpdateInvestigationPersonInput, { nullable: true })
  person?: UpdateInvestigationPersonInput;

  @Field(() => UpdateInvestigationBusinessInput, { nullable: true })
  business?: UpdateInvestigationBusinessInput;

  @Field(() => [UpdateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: UpdateInvestigationContactMethodInput[];

  @Field(() => [UpdateInvestigationAliasInput], { nullable: true })
  aliases?: UpdateInvestigationAliasInput[];

  @Field(() => [CreateInvestigationAddressInput], { nullable: true })
  addresses?: CreateInvestigationAddressInput[];
}

export const mapPrismaPartyToInvestigationParty = (mapper: Mapper) => {
  createMap<investigation_party, InvestigationParty>(
    mapper,
    "investigation_party",
    "InvestigationParty",
    forMember(
      (dest) => dest.partyIdentifier,
      mapFrom((src) => src.investigation_party_guid),
    ),
    forMember(
      (dest) => dest.partyTypeCode,
      mapFrom((src) => src.party_type_code_ref),
    ),
    forMember(
      (dest) => dest.investigationGuid,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.partyReference,
      mapFrom((src) => src.party_guid_ref),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.person,
      mapFrom((src) => {
        if (src.investigation_person && src.investigation_person.length > 0) {
          // Because there is a one to many relationship between party and person this is an array
          // as we are only interested in the active record, we are trusting the caller that they
          // included that in prisma call.
          return mapper.map(src.investigation_person[0], "investigation_person", "InvestigationPerson");
        }
        return undefined;
      }),
    ),
    forMember(
      (dest) => dest.business,
      mapFrom((src) => {
        if (src.investigation_business && src.investigation_business.length > 0) {
          // See comment above.
          return mapper.map(src.investigation_business[0], "investigation_business", "InvestigationBusiness");
        }
        return undefined;
      }),
    ),
    forMember(
      (dest) => dest.partyAssociationRole,
      mapFrom((src) => src.party_association_role_ref),
    ),
    forMember(
      (dest) => dest.enforcementActions,
      mapFrom((src) =>
        mapper.mapArray(
          (src.contravention_party_xref ?? []).map((x) => x.enforcement_action),
          "enforcement_action",
          "EnforcementAction",
        ),
      ),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapFrom((src) =>
        mapper.mapArray(
          src.investigation_contact_method ?? [],
          "investigation_contact_method",
          "InvestigationContactMethod",
        ),
      ),
    ),
    forMember(
      (dest) => dest.aliases,
      mapFrom((src) => mapper.mapArray(src.investigation_alias ?? [], "investigation_alias", "InvestigationAlias")),
    ),
    forMember(
      (dest) => dest.addresses,
      mapFrom((src) =>
        mapper.mapArray(src.investigation_address ?? [], "investigation_address", "InvestigationAddress"),
      ),
    ),
    forMember(
      (dest) => dest.attachmentReferences,
      mapFrom((src) =>
        mapper.mapArray(
          src.investigation_attachment_reference ?? [],
          "investigation_attachment_reference",
          "InvestigationAttachmentReference",
        ),
      ),
    ),
  );
};
