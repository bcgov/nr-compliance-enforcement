// Maps the user's Keycloak client_roles to the agency_code the RLS policies use
const ROLE_TO_AGENCY: Record<string, string> = {
  COS: "COS",
  CEEB: "EPO",
  PARKS: "PARKS",
  NROS: "NROS",
};

export const agencyFromRoles = (clientRoles: string | string[] | undefined | null): string => {
  const roles = !clientRoles
    ? []
    : Array.isArray(clientRoles)
      ? clientRoles
      : clientRoles
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);

  const agencies = Object.entries(ROLE_TO_AGENCY)
    .filter(([role]) => roles.includes(role))
    .map(([, agency]) => agency);

  if (agencies.length === 0) {
    throw new Error(`User agency is not configured correctly. No agency role found.`);
  }
  if (agencies.length > 1) {
    throw new Error(`User agency is not configured correctly. Multiple agency roles found.`);
  }
  return agencies[0];
};
