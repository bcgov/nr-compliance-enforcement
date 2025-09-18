import { contact_method as _contact_method } from "./contact_method";
import { contact_method_h as _contact_method_h } from "./contact_method_h";
import { contact_method_type_code as _contact_method_type_code } from "./contact_method_type_code";
import { person as _person } from "./person";
import { person_h as _person_h } from "./person_h";
import { park as _park } from "./park";
import { park_area as _park_area } from "./park_area";
import { park_area_mapping as _park_area_mapping } from "./park_area_mapping";
import { park_area_xref as _park_area_xref } from "./park_area_xref";
import { agency_code as _agency_code } from "./agency_code";
import { case_activity as _case_activity } from "./case_activity";
import { case_activity_type_code as _case_activity_type_code } from "./case_activity_type_code";
import { case_file as _case_file } from "./case_file";
import { case_status_code as _case_status_code } from "./case_status_code";
import { case_activity_h as _case_activity_h } from "./case_activity_h";
import { case_file_h as _case_file_h } from "./case_file_h";
import { business as _business } from "./business";
import { business_h as _business_h } from "./business_h";
import { party as _party } from "./party";
import { party_h as _party_h } from "./party_h";
import { party_type_code as _party_type_code } from "./party_type_code";
import { legal_document as _legal_document } from "./legal_document";
import { legal_document_node as _legal_document_node } from "./legal_document_node";
import { legal_document_source as _legal_document_source } from "./legal_document_source";

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
  export class agency_code extends _agency_code {}
  export class case_activity extends _case_activity {}
  export class case_activity_type_code extends _case_activity_type_code {}
  export class case_file extends _case_file {}
  export class case_status_code extends _case_status_code {}
  export class case_activity_h extends _case_activity_h {}
  export class case_file_h extends _case_file_h {}
  export class business extends _business {}
  export class business_h extends _business_h {}
  export class party extends _party {}
  export class party_h extends _party_h {}
  export class party_type_code extends _party_type_code {}
  export class legal_document extends _legal_document {}
  export class legal_document_node extends _legal_document_node {}
  export class legal_document_source extends _legal_document_source {}

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
    agency_code,
    case_activity,
    case_activity_type_code,
    case_file,
    case_status_code,
    case_activity_h,
    case_file_h,
    business,
    business_h,
    party,
    party_h,
    party_type_code,
    legal_document,
    legal_document_node,
    legal_document_source,
  ];
}
