import Option from "../app/option";

export interface Assessment {
    assessment_type: string[];
    action_required?: Option;
    justification?: Option;
    officer?: Option;
    date?: Date;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
  }
  