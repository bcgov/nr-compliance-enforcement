import { inspection as _inspection } from "./inspection";
import { inspection_h as _inspection_h } from "./inspection_h";
import { inspection_status_code as _inspection_status_code } from "./inspection_status_code";
import { inspection_status_code_h as _inspection_status_code_h } from "./inspection_status_code_h";
import { officer_inspection_xref as _officer_inspection_xref } from "./officer_inspection_xref";
import { officer_inspection_xref_code as _officer_inspection_xref_code } from "./officer_inspection_xref_code";
import { officer_inspection_xref_code_h as _officer_inspection_xref_code_h } from "./officer_inspection_xref_code_h";
import { officer_inspection_xref_h as _officer_inspection_xref_h } from "./officer_inspection_xref_h";

export namespace PrismaModel {
  export class inspection extends _inspection {}
  export class inspection_h extends _inspection_h {}
  export class inspection_status_code extends _inspection_status_code {}
  export class inspection_status_code_h extends _inspection_status_code_h {}
  export class officer_inspection_xref extends _officer_inspection_xref {}
  export class officer_inspection_xref_code extends _officer_inspection_xref_code {}
  export class officer_inspection_xref_code_h extends _officer_inspection_xref_code_h {}
  export class officer_inspection_xref_h extends _officer_inspection_xref_h {}

  export const extraModels = [
    inspection,
    inspection_h,
    inspection_status_code,
    inspection_status_code_h,
    officer_inspection_xref,
    officer_inspection_xref_code,
    officer_inspection_xref_code_h,
    officer_inspection_xref_h,
  ];
}
