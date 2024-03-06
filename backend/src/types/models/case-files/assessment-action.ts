import { UUID } from "crypto";
export class AssessmentActionDto {
    actorGuid: UUID;
    actionDate: Date;
    actionCode: string;
    shortDescription: string;
    longDescription: string;
    activeInd: boolean;
}