import { investigation as _investigation } from "./investigation";
import { investigation_h as _investigation_h } from "./investigation_h";
import { investigation_status_code as _investigation_status_code } from "./investigation_status_code";
import { investigation_status_code_h as _investigation_status_code_h } from "./investigation_status_code_h";
import { officer_investigation_xref as _officer_investigation_xref } from "./officer_investigation_xref";
import { officer_investigation_xref_code as _officer_investigation_xref_code } from "./officer_investigation_xref_code";
import { officer_investigation_xref_code_h as _officer_investigation_xref_code_h } from "./officer_investigation_xref_code_h";
import { officer_investigation_xref_h as _officer_investigation_xref_h } from "./officer_investigation_xref_h";
import { flyway_schema_history as _flyway_schema_history } from "./flyway_schema_history";
import { investigation_business as _investigation_business } from "./investigation_business";
import { investigation_business_h as _investigation_business_h } from "./investigation_business_h";
import { investigation_party as _investigation_party } from "./investigation_party";
import { investigation_party_h as _investigation_party_h } from "./investigation_party_h";
import { investigation_person as _investigation_person } from "./investigation_person";
import { investigation_person_h as _investigation_person_h } from "./investigation_person_h";
import { continuation_report as _continuation_report } from "./continuation_report";
import { contravention as _contravention } from "./contravention";
import { contravention_party_xref as _contravention_party_xref } from "./contravention_party_xref";

export namespace PrismaModel {
  export class investigation extends _investigation {}
  export class investigation_h extends _investigation_h {}
  export class investigation_status_code extends _investigation_status_code {}
  export class investigation_status_code_h extends _investigation_status_code_h {}
  export class officer_investigation_xref extends _officer_investigation_xref {}
  export class officer_investigation_xref_code extends _officer_investigation_xref_code {}
  export class officer_investigation_xref_code_h extends _officer_investigation_xref_code_h {}
  export class officer_investigation_xref_h extends _officer_investigation_xref_h {}
  export class flyway_schema_history extends _flyway_schema_history {}
  export class investigation_business extends _investigation_business {}
  export class investigation_business_h extends _investigation_business_h {}
  export class investigation_party extends _investigation_party {}
  export class investigation_party_h extends _investigation_party_h {}
  export class investigation_person extends _investigation_person {}
  export class investigation_person_h extends _investigation_person_h {}
  export class continuation_report extends _continuation_report {}
  export class contravention extends _contravention {}
  export class contravention_party_xref extends _contravention_party_xref {}

  export const extraModels = [
    investigation,
    investigation_h,
    investigation_status_code,
    investigation_status_code_h,
    officer_investigation_xref,
    officer_investigation_xref_code,
    officer_investigation_xref_code_h,
    officer_investigation_xref_h,
    flyway_schema_history,
    investigation_business,
    investigation_business_h,
    investigation_party,
    investigation_party_h,
    investigation_person,
    investigation_person_h,
    continuation_report,
    contravention,
    contravention_party_xref,
  ];
}
