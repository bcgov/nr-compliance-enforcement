import { UUID } from "crypto";

export interface PersonComplaintXref { 
    personComplaintXrefGuid: UUID,
    create_user_id: string,
    update_user_id: string,
    active_ind: boolean,
    person_guid: {
        person_guid: UUID
    }
}