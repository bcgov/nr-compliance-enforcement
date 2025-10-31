import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { inspection_business } from "../../../../prisma/inspection/generated/inspection_business";
import { Field, InputType } from "@nestjs/graphql";
import { BusinessDto } from "../../../common/party";

export class InspectionBusiness implements BusinessDto {
  businessGuid: string;
  name: string;
  isActive: boolean;
  partyGuid: string;
  businessReference?: string;
}

@InputType()
export class CreateInspectionBusinessInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  businessReference: string;
}

export const mapPrismaBusinessToInspectionBusiness = (mapper: Mapper) => {
  createMap<inspection_business, InspectionBusiness>(
    mapper,
    "inspection_business",
    "InspectionBusiness",
    forMember(
      (dest) => dest.businessGuid,
      mapFrom((src) => src.inspection_business_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.partyGuid,
      mapFrom((src) => src.inspection_party_guid),
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
