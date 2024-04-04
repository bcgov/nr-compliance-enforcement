import Option from "../app/option";
import KeyValuePair from "../app/key-value-pair";

export interface Prevention {
  prevention_type: KeyValuePair[];
  officer?: KeyValuePair;
  date?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}