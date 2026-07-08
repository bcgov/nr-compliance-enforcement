import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { investigation_business } from "../../../../prisma/investigation/generated/investigation_business";
import { Field, InputType } from "@nestjs/graphql";
import { BusinessDto } from "../../../common/party";
import {
  CreateInvestigationBusinessIdentifierInput,
  InvestigationBusinessIdentifier,
  UpdateInvestigationBusinessIdentifierInput,
} from "../../investigation_business_identifier/dto/investigation_business_identifier";
import {
  CreateInvestigationBusinessContactInput,
  InvestigationBusinessPersonXref,
  UpdateInvestigationBusinessContactInput,
} from "src/investigation/investigation_business_person_xref/dto/investigation_business_person_xref";

export class InvestigationBusiness implements BusinessDto {
  businessGuid: string;
  name: string;
  isActive: boolean;
  partyGuid: string;
  businessReference?: string;
  businessIdentifiers?: InvestigationBusinessIdentifier[];
  contactPeople?: InvestigationBusinessPersonXref[];
}

@InputType()
export class CreateInvestigationBusinessInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  businessReference?: string;

  @Field(() => [CreateInvestigationBusinessIdentifierInput], { nullable: true })
  businessIdentifiers?: CreateInvestigationBusinessIdentifierInput[];

  @Field(() => [CreateInvestigationBusinessContactInput], { nullable: true })
  contactPeople?: CreateInvestigationBusinessContactInput[];
}

@InputType()
export class UpdateInvestigationBusinessInput {
  @Field(() => String)
  name: string;

  @Field(() => [UpdateInvestigationBusinessIdentifierInput], { nullable: true })
  businessIdentifiers?: UpdateInvestigationBusinessIdentifierInput[];

  @Field(() => [UpdateInvestigationBusinessContactInput], { nullable: true })
  contactPeople?: UpdateInvestigationBusinessContactInput[];
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
      (dest) => dest.contactPeople,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.investigation_business_person_xref ?? [],
          "investigation_business_person_xref",
          "InvestigationBusinessPersonXref",
        ),
      ),
    ),
  );
};
