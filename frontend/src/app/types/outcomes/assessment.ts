import KeyValuePair from "../app/key-value-pair";

export interface Assessment {
  assessment_type: KeyValuePair[];
  action_required?: string | null;
  close_complaint?: boolean;
  justification?: KeyValuePair;
  linked_complaint?: KeyValuePair;
  officer?: KeyValuePair;
  date?: Date | null;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
