import KeyValuePair from "@apptypes/app/key-value-pair";

export interface Prevention {
  id?: string;
  prevention_type: KeyValuePair[];
  officer?: KeyValuePair;
  date?: Date | null;
  agencyCode?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
