export interface SsoToken {
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  scope: string;
  sid: string;
  idir_user_guid: string;
  client_roles: string[];
  identity_provider: string;
  idir_username: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  display_name: string;
  family_name: string;
  email: string;
}
