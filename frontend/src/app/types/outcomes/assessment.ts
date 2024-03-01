import { AssessmentType } from "../app/code-tables/assesment-type";
import { Justification } from "../app/code-tables/justification";
import { Officer } from "../person/person";

export interface Assessment {
    assessment_type: AssessmentType[];
    action_required?: boolean;
    justification?: Justification;
    officer?: Officer;
    date?: Date;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
  }
  