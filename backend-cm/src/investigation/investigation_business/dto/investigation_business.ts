import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_business } from "../../../../prisma/investigation/generated/investigation_business";
import { Field, InputType } from "@nestjs/graphql";
import { BusinessDto } from "../../../common/party";
import {
  CreateInvestigationContactMethodInput,
  InvestigationContactMethod,
  UpdateInvestigationContactMethodInput,
} from "../../investigation_contact_method/dto/investigation_contact_method";
import {
  CreateInvestigationBusinessIdentifierInput,
  InvestigationBusinessIdentifier,
  UpdateInvestigationBusinessIdentifierInput,
} from "../../investigation_business_identifier/dto/investigation_business_identifier";
import {
  CreateInvestigationAliasInput,
  InvestigationAlias,
  UpdateInvestigationAliasInput,
} from "../../investigation_alias/dto/investigation_alias";
import {
  CreateInvestigationBusinessAddressInput,
  InvestigationBusinessAddress,
  UpdateInvestigationBusinessAddressInput,
} from "../../investigation_business_address/dto/investigation_business_address";

export class InvestigationBusiness implements BusinessDto {
  businessGuid: string;
  name: string;
  isActive: boolean;
  partyGuid: string;
  businessReference?: string;
  contactMethods?: InvestigationContactMethod[];
  businessIdentifiers?: InvestigationBusinessIdentifier[];
  aliases?: InvestigationAlias[];
  addresses?: InvestigationBusinessAddress[];
}

@InputType()
export class CreateInvestigationBusinessInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  businessReference?: string;

  @Field(() => [CreateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: CreateInvestigationContactMethodInput[];

  @Field(() => [CreateInvestigationBusinessIdentifierInput], { nullable: true })
  businessIdentifiers?: CreateInvestigationBusinessIdentifierInput[];

  @Field(() => [CreateInvestigationAliasInput], { nullable: true })
  aliases?: CreateInvestigationAliasInput[];

  @Field(() => [CreateInvestigationBusinessAddressInput], { nullable: true })
  addresses?: CreateInvestigationBusinessAddressInput[];
}

@InputType()
export class UpdateInvestigationBusinessInput {
  @Field(() => String)
  name: string;

  @Field(() => [UpdateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: UpdateInvestigationContactMethodInput[];

  @Field(() => [UpdateInvestigationBusinessIdentifierInput], { nullable: true })
  businessIdentifiers?: UpdateInvestigationBusinessIdentifierInput[];

  @Field(() => [UpdateInvestigationAliasInput], { nullable: true })
  aliases?: UpdateInvestigationAliasInput[];

  @Field(() => [UpdateInvestigationBusinessAddressInput], { nullable: true })
  addresses?: UpdateInvestigationBusinessAddressInput[];
}

export const mapPrismaBusinessToInvestigationBusiness = (mapper: Mapper) => {
  createMap<investigation_business, InvestigationBusiness>(
    mapper,
    "investigation_business",
    "InvestigationBusiness",
    forMember(
      (dest) => dest.businessGuid,
      mapFrom((src) => src.investigation_business_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.partyGuid,
      mapFrom((src) => src.investigation_party_guid),
    ),
    forMember(
      (dest) => dest.businessReference,
      mapFrom((src) => src.business_guid_ref),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
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
      (dest) => dest.businessIdentifiers,
      mapFrom((src) =>
        mapper.mapArray(
          src.investigation_business_identifier ?? [],
          "investigation_business_identifier",
          "InvestigationBusinessIdentifier",
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
        mapper.mapArray(
          src.investigation_business_address ?? [],
          "investigation_business_address",
          "InvestigationBusinessAddress",
        ),
      ),
    ),
  );
};
