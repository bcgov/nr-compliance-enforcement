import KeyValuePair from "@apptypes/app/key-value-pair";

export interface Assessment {
  id?: string;
  agency?: string;
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
  contacted_complainant?: boolean;
  attended?: boolean;
  location_type?: KeyValuePair;
  conflict_history?: KeyValuePair | null;
  category_level?: KeyValuePair | null;
  assessment_cat1_type: KeyValuePair[];
  assessment_type_legacy?: KeyValuePair[];
}
