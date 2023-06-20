import { UUID } from "crypto"

export interface Person { 
    officer_guid:string,
    complaint_identifier: string,
    user_id: string,
    create_user_id: string,
    auth_user_guid: string,
    office_guid: {
        geo_organization_unit_code: {
            long_description: string
        }
    },
    person_guid: {
        person_guid: UUID,
        first_name: string,
        middle_name_1: string,
        middle_name_2: string,
        last_name: string
    }
}