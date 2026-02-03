import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { contact_method } from "../../../../prisma/shared/generated/contact_method";

export class ContactMethod {
  typeCode: string;
  typeShortDescription: string;
  typeDescription: string;
  value: string;
  isPrimary: boolean;
}

export const mapPrismaContactMethodToContactMethod = (mapper: Mapper) => {
  createMap<contact_method, ContactMethod>(
    mapper,
    "contact_method",
    "ContactMethod",
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
