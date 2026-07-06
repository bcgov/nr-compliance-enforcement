import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { investigation_business_person_xref } from "prisma/investigation/generated/investigation_business_person_xref";
import { InvestigationBusinessPersonAddressXref } from "src/investigation/investigation_business_person_address_xref/dto/investigation_business_person_address_xref";
import {
  CreateInvestigationContactMethodInput,
  InvestigationContactMethod,
  UpdateInvestigationContactMethodInput,
} from "src/investigation/investigation_contact_method/dto/investigation_contact_method";
import {
  CreateInvestigationPersonInput,
  UpdateInvestigationPersonInput,
} from "src/investigation/investigation_person/dto/investigation_person";
import { Business } from "src/shared/business/dto/business";
import { Person } from "src/shared/person/dto/person";

export class InvestigationBusinessPersonXref {
  businessPersonXrefGuid: string;
  title: string;
  displayInInvestigation: boolean;
  isPrimary: boolean;
  business: Business;
  person: Person;
  contactMethods?: [InvestigationContactMethod]; // These are at the party level for people so need to be passed in parallel
  associatedAddresses?: [InvestigationBusinessPersonAddressXref];
}

@InputType()
export class CreateInvestigationBusinessContactInput {
  @Field(() => CreateInvestigationPersonInput)
  person: CreateInvestigationPersonInput;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Boolean, { nullable: true })
  displayInInvestigation?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPrimary?: boolean;

  @Field(() => [CreateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: CreateInvestigationContactMethodInput[];

  // office references: always investigation_address_guids (client-generated for new addresses)
  @Field(() => [String], { nullable: true })
  officeAddressGuids?: string[];
}

@InputType()
export class UpdateInvestigationBusinessContactInput {
  @Field(() => String, { nullable: true })
  businessPersonXrefGuid?: string;

  @Field(() => UpdateInvestigationPersonInput, { nullable: true })
  person?: UpdateInvestigationPersonInput;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Boolean, { nullable: true })
  displayInInvestigation?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPrimary?: boolean;

  @Field(() => [UpdateInvestigationContactMethodInput], { nullable: true })
  contactMethods?: UpdateInvestigationContactMethodInput[];

  @Field(() => [String], { nullable: true })
  officeAddressGuids?: string[];
}

export const mapPrismaInvestigationBusinessPersonXrefToInvestigationBusinessPersonXref = (mapper: Mapper) => {
  createMap<investigation_business_person_xref, InvestigationBusinessPersonXref>(
    mapper,
    "investigation_business_person_xref",
    "InvestigationBusinessPersonXref",
    forMember(
      (dest) => dest.businessPersonXrefGuid,
      mapFrom((src) => src.investigation_business_person_xref_guid),
    ),
    forMember(
      (dest) => dest.displayInInvestigation,
      mapFrom((src) => src.display_in_investigation_ind),
    ),
    forMember(
      (dest) => dest.isPrimary,
      mapFrom((src) => src.is_primary),
    ),
    forMember(
      (dest) => dest.title,
      mapFrom((src) => src.title_role),
    ),
    forMember(
      (dest) => dest.business,
      mapWithArguments((src) =>
        mapper.map(src.investigation_business, "investigation_business", "InvestigationBusiness"),
      ),
    ),
    forMember(
      (dest) => dest.person,
      mapWithArguments((src) => mapper.map(src.investigation_person, "investigation_person", "InvestigationPerson")),
    ),
    forMember(
      (dest) => dest.contactMethods,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.investigation_person?.investigation_party?.investigation_contact_method ?? [],
          "investigation_contact_method",
          "InvestigationContactMethod",
        ),
      ),
    ),
    forMember(
      (dest) => dest.associatedAddresses,
      mapWithArguments((src) =>
        mapper.mapArray(
          src.investigation_business_person_address_xref ?? [],
          "investigation_business_person_address_xref",
          "InvestigationBusinessPersonAddressXref",
        ),
      ),
    ),
  );
};
