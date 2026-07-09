import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { investigation_contact_method } from "../../../../prisma/investigation/generated/investigation_contact_method";
import { Field, InputType } from "@nestjs/graphql";

export class InvestigationContactMethod {
  contactMethodGuid: string;
  typeCode: string;
  value: string;
  isPrimary: boolean;
  isActive: boolean;
}

@InputType()
export class CreateInvestigationContactMethodInput {
  @Field(() => String, { nullable: true })
  contactMethodGuid?: string;

  @Field(() => String)
  typeCode: string;

  @Field(() => String, { nullable: true })
  value: string;

  @Field(() => Boolean, { nullable: true })
  isPrimary: boolean;
}

@InputType()
export class UpdateInvestigationContactMethodInput {
  @Field(() => String, { nullable: true })
  contactMethodGuid?: string;

  @Field(() => String)
  typeCode: string;

  @Field(() => String, { nullable: true })
  value: string;

  @Field(() => Boolean, { nullable: true })
  isPrimary: boolean;
}

export const mapPrismaContactMethodToInvestigationContactMethod = (mapper: Mapper) => {
  createMap<investigation_contact_method, InvestigationContactMethod>(
    mapper,
    "investigation_contact_method",
    "InvestigationContactMethod",
    forMember(
      (dest) => dest.contactMethodGuid,
      mapFrom((src) => src.investigation_contact_method_guid),
    ),
    forMember(
      (dest) => dest.typeCode,
      mapFrom((src) => src.contact_method_type_code_ref),
    ),
    forMember(
      (dest) => dest.value,
      mapFrom((src) => src.contact_value),
    ),
    forMember(
      (dest) => dest.isPrimary,
      mapFrom((src) => src.is_primary),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
  );
};
