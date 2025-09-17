import { investigation as _investigation } from "./investigation";
import { investigation_h as _investigation_h } from "./investigation_h";
import { investigation_status_code as _investigation_status_code } from "./investigation_status_code";
import { investigation_status_code_h as _investigation_status_code_h } from "./investigation_status_code_h";
import { officer_investigation_xref as _officer_investigation_xref } from "./officer_investigation_xref";
import { officer_investigation_xref_code as _officer_investigation_xref_code } from "./officer_investigation_xref_code";
import { officer_investigation_xref_code_h as _officer_investigation_xref_code_h } from "./officer_investigation_xref_code_h";
import { officer_investigation_xref_h as _officer_investigation_xref_h } from "./officer_investigation_xref_h";
import { flyway_schema_history as _flyway_schema_history } from "./flyway_schema_history";

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
  ];
}
