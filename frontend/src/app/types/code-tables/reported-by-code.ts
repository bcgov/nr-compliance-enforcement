export interface ReportedByCode {
  reported_by_code: string;
  short_description: string;
  long_description: string;
  display_order: number;
  active_ind: boolean;
  create_user_id: string;
  create_utc_timestamp: Date | null;
  update_user_id: string;
  update_utc_timestamp: Date | null;
}
