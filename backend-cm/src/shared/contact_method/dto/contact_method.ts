import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { contact_method } from "../../../../prisma/shared/generated/contact_method";

export class ContactMethod {
  typeCode: string;
  typeShortDescription: string;
  typeDescription: string;
  value: string;
}

export const mapPrismaContactMethodToContactMethod = (mapper: Mapper) => {
  createMap<contact_method, ContactMethod>(
    mapper,
    "contact_method",
    "ContactMethod",
    forMember(
      (dest) => dest.typeCode,
      mapFrom((src) => src.contact_method_type_code),
    ),
    forMember(
      (dest) => dest.typeShortDescription,
      mapFrom(
        (src) =>
          src.contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code
            ?.short_description,
      ),
    ),
    forMember(
      (dest) => dest.typeDescription,
      mapFrom(
        (src) =>
          src.contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code
            ?.long_description,
      ),
    ),
    forMember(
      (dest) => dest.value,
      mapFrom((src) => src.contact_value),
    ),
  );
};
