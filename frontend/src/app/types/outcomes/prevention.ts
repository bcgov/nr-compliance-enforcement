import Option from "../app/option";

export interface Prevention {
  assessment_type: Option[];
  officer?: Option;
  date?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}