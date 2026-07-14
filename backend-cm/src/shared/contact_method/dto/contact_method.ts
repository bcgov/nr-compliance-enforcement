import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { contact_method } from "../../../../prisma/shared/generated/contact_method";
import { Field, InputType } from "@nestjs/graphql";

export class ContactMethod {
  contactMethodGuid: string;
  typeCode: string;
  typeShortDescription: string;
  typeDescription: string;
  value: string;
  isPrimary: boolean;
}

@InputType()
export class ContactMethodInput {
  @Field(() => String, { nullable: true })
  contactMethodGuid?: string;

  @Field(() => String)
  typeCode: string;

  @Field(() => String)
  value: string;

  @Field(() => Boolean, { nullable: true })
  isPrimary?: boolean;
}

@InputType()
export class ContactMethodMatchInput {
  @Field(() => String)
  typeCode: string;

  @Field(() => String, { nullable: true })
  value: string;
}

export const mapPrismaContactMethodToContactMethod = (mapper: Mapper) => {
  createMap<contact_method, ContactMethod>(
    mapper,
    "contact_method",
    "ContactMethod",
    forMember(
      (dest) => dest.contactMethodGuid,
      mapFrom((src) => src.contact_method_guid),
    ),
    forMember(
      (dest) => dest.typeCode,
      mapFrom((src) => src.contact_method_type),
    ),
    forMember(
      (dest) => dest.typeShortDescription,
      mapFrom((src) => src.contact_method_type_code?.short_description),
    ),
    forMember(
      (dest) => dest.typeDescription,
      mapFrom((src) => src.contact_method_type_code?.long_description),
    ),
    forMember(
      (dest) => dest.value,
      mapFrom((src) => src.contact_value),
    ),
    forMember(
      (dest) => dest.isPrimary,
      mapFrom((src) => src.is_primary),
    ),
  );
};
