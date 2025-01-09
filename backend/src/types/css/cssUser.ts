export interface CssUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  attributes: {
    idir_user_guid: string[];
    idir_username: string[];
    display_name: string[];
  };
}
