import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { CreateInspectionBusinessInput, InspectionBusiness } from "../../inspection_business/dto/inspection_business";
import { CreateInspectionPersonInput, InspectionPerson } from "../../inspection_person/dto/inspection_person";
import { inspection_party } from "../../../../prisma/inspection/generated/inspection_party";
import { Field, InputType } from "@nestjs/graphql";
import { PartyDto } from "../../../common/party";

export class InspectionParty implements PartyDto {
  partyIdentifier: string;
  partyTypeCode: string;
  person?: InspectionPerson;
  business?: InspectionBusiness;
  isActive: boolean;
  inspectionGuid: string;
  partyReference?: string;
  partyAssociationRole?: string;
}

@InputType()
export class CreateInspectionPartyInput {
  @Field(() => String)
  partyTypeCode: string;

  @Field(() => String)
  partyReference: string;

  @Field(() => CreateInspectionPersonInput)
  person: CreateInspectionPersonInput;

  @Field(() => CreateInspectionBusinessInput)
  business: CreateInspectionBusinessInput;

  @Field(() => String)
  partyAssociationRole: string;
}

export const mapPrismaPartyToInspectionParty = (mapper: Mapper) => {
  createMap<inspection_party, InspectionParty>(
    mapper,
    "inspection_party",
    "InspectionParty",
    forMember(
      (dest) => dest.partyIdentifier,
      mapFrom((src) => src.inspection_party_guid),
    ),
    forMember(
      (dest) => dest.partyTypeCode,
      mapFrom((src) => src.party_type_code_ref),
    ),
    forMember(
      (dest) => dest.inspectionGuid,
      mapFrom((src) => src.inspection_guid),
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
        if (src.inspection_person && src.inspection_person.length > 0) {
          // Because there is a one to many relationship between party and person this is an array
          // as we are only interested in the active record, we are trusting the caller that they
          // included that in prisma call.
          return mapper.map(src.inspection_person[0], "inspection_person", "InspectionPerson");
        }
        return undefined;
      }),
    ),
    forMember(
      (dest) => dest.business,
      mapFrom((src) => {
        if (src.inspection_business && src.inspection_business.length > 0) {
          // See comment above.
          return mapper.map(src.inspection_business[0], "inspection_business", "InspectionBusiness");
        }
        return undefined;
      }),
    ),
    forMember(
      (dest) => dest.partyAssociationRole,
      mapFrom((src) => src.party_association_role_ref),
    ),
  );
};
