import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import {
  CreateInvestigationBusinessInput,
  InvestigationBusiness,
} from "../../investigation_business/dto/investigation_business";
import {
  CreateInvestigationPersonInput,
  InvestigationPerson,
} from "../../investigation_person/dto/investigation_person";
import { investigation_party } from "../../../../prisma/investigation/generated/investigation_party";
import { Field, InputType } from "@nestjs/graphql";
import { PartyDto } from "../../../common/party";

export class InvestigationParty implements PartyDto {
  partyIdentifier: string;
  partyTypeCode: string;
  person?: InvestigationPerson;
  business?: InvestigationBusiness;
  isActive: boolean;
  investigationGuid: string;
  partyReference?: string;
  partyAssociationRole?: string;
}

@InputType()
export class CreateInvestigationPartyInput {
  @Field(() => String)
  partyTypeCode: string;

  @Field(() => String)
  partyReference: string;

  @Field(() => CreateInvestigationPersonInput)
  person: CreateInvestigationPersonInput;

  @Field(() => CreateInvestigationBusinessInput)
  business: CreateInvestigationBusinessInput;

  @Field(() => String)
  partyAssociationRole: string;
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
  );
};
