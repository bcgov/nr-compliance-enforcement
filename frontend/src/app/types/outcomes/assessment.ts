import { AssessmentType } from "../app/code-tables/assesment-type";
import { Justification } from "../app/code-tables/justification";
import Option from "../app/option";

export interface Assessment {
    assessment_type: AssessmentType[];
    action_required?: Option;
    justification?: Option;
    officer?: Option;
    date?: Date;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
  }
  