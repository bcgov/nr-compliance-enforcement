import KeyValuePair from "../app/key-value-pair";

export interface Assessment {
  assessment_type: KeyValuePair[];
  action_required?: string | null
  justification?: KeyValuePair,
  officer?: KeyValuePair;
  date?: Date | null;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
