import KeyValuePair from "@apptypes/app/key-value-pair";

export interface Prevention {
  prevention_type: KeyValuePair[];
  officer?: KeyValuePair;
  date?: Date | null;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
