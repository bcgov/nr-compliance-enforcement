export interface ComplaintMessage {
  pattern: string;
  data: WebEOCComplaintMessageData;
}

export interface WebEOCComplaintMessageData {
  id: string;
  complaintData: WebEOCComplaint;
}

export interface WebEOCComplaint {
  tablename: string;
  dataid: string;
  username: string;
  positionname: string;
  entrydate: string;
  subscribername: string;
  prevdataid: string;
  report_type: string;
  incident_number: string;
  created_by_datetime: string;
  remove: string;
  incident_datetime: string;
  call_type_gir: string;
  address: string;
  address_coordinates_lat: string;
  address_coordinates_long: string;
  cos_area_community: string;
  cos_district: string;
  cos_zone: string;
  cos_region: string;
  cos_location_description: string;
  cos_caller_name: string;
  cos_primary_phone_lst: string;
  cos_primary_phone: string;
  cos_alt_phone_lst: string;
  cos_alt_phone: string;
  cos_alt_phone_2_lst: string;
  cos_alt_phone_2: string;
  cos_caller_email: string;
  caller_address: string;
  cos_reffered_by_txt: string;
  cos_reffered_by_lst: string;
  cos_call_details: string;
  nature_of_complaint: string;
  species: string;
  attractant_bbq: string;
  attractant_beehive: string;
  attractant_bird_feeder: string;
  attractant_campground_food: string;
  attractant_checked: string;
  attractant_compost: string;
  attractant_crops: string;
  attractant_freezer: string;
  attractant_fruit_tree: string;
  attractant_garbage: string;
  attractant_hunter_kill: string;
  attractant_industrial_camp: string;
  attractant_livestock: string;
  attractant_livestock_feed: string;
  attractant_not_applicable: string;
  attractant_other: string;
  attractant_pet_food: string;
  attractant_pets: string;
  attractant_vegetable_garden: string;
  attractant_vinyard: string;
  attractant_other_text: string;
  attractants_list: string;
  violation_type: string;
  suspect_details: string;
  observe_violation: string;
  violation_in_progress: string;
  created_by_position: string;
  created_by_username: string;
  back_number_of_days: string;
  back_number_of_hours: string;
  back_number_of_minutes: string;
}
