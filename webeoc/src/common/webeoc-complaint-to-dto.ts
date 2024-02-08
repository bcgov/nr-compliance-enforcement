import { Complaint } from 'src/types/Complaints';

export function convertToComplaintDto(complaint: Complaint): any {
  const truncateString = (str: string, num: number) =>
    str.length > num ? `${str.slice(0, num)}… DATA TRUNCATED` : str;

  // Assuming the Pacific Time Zone (PT) for the conversion to UTC
  const convertToUtc = (dateTime: string) => {
    const date = new Date(dateTime);
    // Example logic to convert PT to UTC, adjust according to actual requirements
    date.setHours(date.getHours() + 7); // PT is generally UTC-7
    return date;
  };

  return {
    details: truncateString(complaint.cos_call_details, 3980),
    name: truncateString(complaint.cos_caller_name, 100),
    address: truncateString(complaint.caller_address, 100),
    email: truncateString(complaint.cos_caller_email, 100),
    phone1: truncateString(complaint.cos_primary_phone, 100),
    phone2: truncateString(complaint.cos_alt_phone, 100),
    phone3: truncateString(complaint.cos_alt_phone_2, 100),
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(complaint.address_coordinates_long),
        parseFloat(complaint.address_coordinates_lat),
      ],
    },
    locationSummary: truncateString(complaint.address, 100),
    locationDetail: complaint.cos_location_description,
    status: 'OPEN',
    reportedBy: complaint.subscribername,
    ownedBy: 'COS',
    reportedByOther: complaint.cos_reffered_by_txt,
    incidentDateTime: convertToUtc(complaint.incident_datetime),
    reportedOn: convertToUtc(complaint.created_by_datetime),
    updatedOn: new Date(),
    createdBy: complaint.username,
    updatedBy: complaint.created_by_username,
    // organization: {
    //   area: complaint.cos_area_community,
    //   zone: complaint.cos_zone,
    //   region: complaint.cos_region,
    // },
    user: 'webeoc',
  };
}
