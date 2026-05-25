import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_business_identifier } from "../../../../prisma/investigation/generated/investigation_business_identifier";
import { Field, InputType } from "@nestjs/graphql";

export class InvestigationBusinessIdentifier {
  businessIdentifierGuid: string;
  businessIdentifierCode: string;
  identifierValue: string;
  isActive: boolean;
}

@InputType()
export class CreateInvestigationBusinessIdentifierInput {
  @Field(() => String)
  businessIdentifierCode: string;

  @Field(() => String)
  identifierValue: string;
}

@InputType()
export class UpdateInvestigationBusinessIdentifierInput {
  @Field(() => String, { nullable: true })
  businessIdentifierGuid?: string;

  @Field(() => String)
  businessIdentifierCode: string;

  @Field(() => String)
  identifierValue: string;
}

export const mapPrismaBusinessIdentifierToInvestigationBusinessIdentifier = (mapper: Mapper) => {
  createMap<investigation_business_identifier, InvestigationBusinessIdentifier>(
    mapper,
    "investigation_business_identifier",
    "InvestigationBusinessIdentifier",
    forMember(
      (dest) => dest.businessIdentifierGuid,
      mapFrom((src) => src.investigation_business_identifier_guid),
    ),
    forMember(
      (dest) => dest.businessIdentifierCode,
      mapFrom((src) => src.business_identifier_code_ref),
    ),
    forMember(
      (dest) => dest.identifierValue,
      mapFrom((src) => src.identifier_value),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
  );
};
