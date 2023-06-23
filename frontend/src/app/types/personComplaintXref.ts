import { UUID } from "crypto";

export interface PersonComplaintXref { 
    personComplaintXrefGuid: UUID,
    create_user_id: string,
    create_user_guid: UUID,
    update_user_id: string,
    update_user_guid: UUID,
    active_ind: boolean,
    person_guid: {
        person_guid: UUID
    }
}