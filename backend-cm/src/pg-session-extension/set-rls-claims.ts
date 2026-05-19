import { agencyFromRoles } from "./agency-from-roles";

export interface RlsClaimUser {
  idir_user_guid?: string;
  client_roles?: string | string[];
  exp?: number;
}

// Runs inside a Prisma transaction with the users JWT claims set once. Sets inTransactionContext
// so the pg-session extension doesn't add claims for nested transactions.
export async function setRlsClaims(tx: any, user?: RlsClaimUser): Promise<void> {
  if (!user) return;

  if (user.idir_user_guid) {
    await tx.$executeRawUnsafe(`SET LOCAL jwt.claims.idir_user_guid = '${user.idir_user_guid.replaceAll("'", "''")}'`);
  }

  if (user.client_roles) {
    const rolesString = Array.isArray(user.client_roles) ? user.client_roles.join(",") : user.client_roles;
    await tx.$executeRawUnsafe(`SET LOCAL jwt.claims.client_roles = '${rolesString.replaceAll("'", "''")}'`);

    // Derive the user's agency here so the RLS policies don't need to look it up - each schema's
    // policy stays self-contained, with no cross-schema query (the schemas can move databases).
    const agency = agencyFromRoles(user.client_roles);
    await tx.$executeRawUnsafe(`SET LOCAL jwt.claims.agency_code = '${agency.replaceAll("'", "''")}'`);
  }

  // Default 0 so an unset exp reads as expired.
  await tx.$executeRawUnsafe(`SET LOCAL jwt.claims.exp = '${user.exp ?? 0}'`);
}
