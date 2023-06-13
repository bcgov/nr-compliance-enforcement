export interface HwcrComplaint{ 
    complaint_identifier: {complaint_identifier: string, person_complaint_xref: {}, geo_organization_unit_code:{short_description: string}, incident_datetime: string, incident_reported_datetime: string, location_summary_text:string, update_user_id:string, update_timestamp:string, complaint_status_code:{long_description:string}};
    hwcr_complaint_nature_code: {long_description:string}
    species_code: {short_description:string}
    update_timestamp: string
}