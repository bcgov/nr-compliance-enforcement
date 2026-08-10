// Maps the user's Keycloak client_roles to the agency_code the RLS policies use
const ROLE_TO_AGENCY: Record<string, string> = {
  COS: "COS",
  CEEB: "EPO",
  PARKS: "PARKS",
  NROS: "NROS",
  MINES: "MINES",
};

export type ClientRoles = string | string[] | undefined | null;

export const normalizeRoles = (clientRoles: ClientRoles): string[] => {
  if (!clientRoles) return [];
  if (Array.isArray(clientRoles)) return clientRoles;
  return clientRoles
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
};

export const agenciesFromRoles = (clientRoles: ClientRoles): string[] => {
  const roles = normalizeRoles(clientRoles);

  return Object.entries(ROLE_TO_AGENCY)
    .filter(([role]) => roles.includes(role))
    .map(([, agency]) => agency);
};

export const agencyFromRoles = (clientRoles: ClientRoles): string => {
  const agencies = agenciesFromRoles(clientRoles);

  if (agencies.length === 0) {
    throw new Error(`User agency is not configured correctly. No agency role found.`);
  }
  if (agencies.length > 1) {
    throw new Error(`User agency is not configured correctly. Multiple agency roles found.`);
  }
  return agencies[0];
};
