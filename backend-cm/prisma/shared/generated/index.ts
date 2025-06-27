import { contact_method as _contact_method } from "./contact_method";
import { contact_method_h as _contact_method_h } from "./contact_method_h";
import { contact_method_type_code as _contact_method_type_code } from "./contact_method_type_code";
import { person as _person } from "./person";
import { person_h as _person_h } from "./person_h";
import { park as _park } from "./park";
import { park_area as _park_area } from "./park_area";
import { park_area_mapping as _park_area_mapping } from "./park_area_mapping";
import { park_area_xref as _park_area_xref } from "./park_area_xref";

export namespace PrismaModel {
  export class contact_method extends _contact_method {}
  export class contact_method_h extends _contact_method_h {}
  export class contact_method_type_code extends _contact_method_type_code {}
  export class person extends _person {}
  export class person_h extends _person_h {}
  export class park extends _park {}
  export class park_area extends _park_area {}
  export class park_area_mapping extends _park_area_mapping {}
  export class park_area_xref extends _park_area_xref {}

  export const extraModels = [
    contact_method,
    contact_method_h,
    contact_method_type_code,
    person,
    person_h,
    park,
    park_area,
    park_area_mapping,
    park_area_xref,
  ];
}
