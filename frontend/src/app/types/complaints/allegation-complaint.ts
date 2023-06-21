export interface AllegationComplaint{ 
    complaint_identifier: {person_complaint_xref: [{person_guid: {first_name: string, last_name: string}}],complaint_identifier: string, geo_organization_unit_code:{short_description: string}, incident_datetime: string, incident_reported_datetime: string, location_summary_text:string, update_user_id:string, update_timestamp:string, complaint_status_code:{long_description:string}};
    violation_code: {long_description:string},
    allegation_complaint_guid: string,
    in_progress_ind: string
    update_timestamp: string
}