export interface AllegationComplaint{ 
    complaint_identifier: {complaint_identifier: string,
        person_complaint_xref: [{
            person_guid: {
                person_guid: string,
                first_name: string,
                middle_name_1: string,
                middle_name_2: string,
                last_name: string
            }
        }], 
        geo_organization_unit_code:{short_description: string}, incident_datetime: string, incident_reported_datetime: string, location_summary_text:string, update_user_id:string, update_timestamp:string, complaint_status_code:{long_description:string}};
    violation_code: {long_description:string}
    in_progress_ind: string
    update_timestamp: string
}