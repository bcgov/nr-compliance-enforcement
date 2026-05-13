// Maps the user's Keycloak client_roles to the agency_code the RLS policies use

const ROLE_TO_AGENCY: Record<string, string> = {
  COS: "COS",
  CEEB: "EPO",
  PARKS: "PARKS",
  NROS: "NROS",
};

const ROLE_PRIORITY = ["COS", "CEEB", "PARKS", "NROS"];
const DEFAULT_AGENCY = "NRS";

export const agencyFromRoles = (clientRoles: string | string[] | undefined | null): string => {
  if (!clientRoles) return DEFAULT_AGENCY;
  const roles = Array.isArray(clientRoles)
    ? clientRoles
    : clientRoles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

  let agency = DEFAULT_AGENCY;
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      agency = ROLE_TO_AGENCY[role];
    }
  }
  return agency;
};
