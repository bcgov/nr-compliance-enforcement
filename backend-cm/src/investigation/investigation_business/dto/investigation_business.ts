import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_business } from "../../../../prisma/investigation/generated/investigation_business";
import { Field, InputType } from "@nestjs/graphql";
import { BusinessDto } from "../../../common/party";

export class InvestigationBusiness implements BusinessDto {
  businessGuid: string;
  name: string;
  isActive: boolean;
  partyGuid: string;
  businessReference?: string;
}

@InputType()
export class CreateInvestigationBusinessInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  businessReference: string;
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
  );
};
