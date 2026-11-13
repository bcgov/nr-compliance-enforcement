import { flyway_schema_history as _flyway_schema_history } from "./flyway_schema_history";
import { inspection as _inspection } from "./inspection";
import { inspection_business as _inspection_business } from "./inspection_business";
import { inspection_business_h as _inspection_business_h } from "./inspection_business_h";
import { inspection_h as _inspection_h } from "./inspection_h";
import { inspection_party as _inspection_party } from "./inspection_party";
import { inspection_party_h as _inspection_party_h } from "./inspection_party_h";
import { inspection_person as _inspection_person } from "./inspection_person";
import { inspection_person_h as _inspection_person_h } from "./inspection_person_h";
import { inspection_status_code as _inspection_status_code } from "./inspection_status_code";
import { inspection_status_code_h as _inspection_status_code_h } from "./inspection_status_code_h";

export namespace PrismaModel {
  export class flyway_schema_history extends _flyway_schema_history {}
  export class inspection extends _inspection {}
  export class inspection_business extends _inspection_business {}
  export class inspection_business_h extends _inspection_business_h {}
  export class inspection_h extends _inspection_h {}
  export class inspection_party extends _inspection_party {}
  export class inspection_party_h extends _inspection_party_h {}
  export class inspection_person extends _inspection_person {}
  export class inspection_person_h extends _inspection_person_h {}
  export class inspection_status_code extends _inspection_status_code {}
  export class inspection_status_code_h extends _inspection_status_code_h {}

  export const extraModels = [
    flyway_schema_history,
    inspection,
    inspection_business,
    inspection_business_h,
    inspection_h,
    inspection_party,
    inspection_party_h,
    inspection_person,
    inspection_person_h,
    inspection_status_code,
    inspection_status_code_h,
  ];
}
