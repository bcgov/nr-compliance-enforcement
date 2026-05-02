import { getRequest } from "./request-interceptor";
import { inTransactionContext } from "./prisma-pg-session-extension";

/**
 * Runs inside a single Prisma transaction with the JWT claims set once at the start.
 * Tells the pg-session extension to skip its per-query transaction wrap so reads inside the
 * callback don't open nested transactions.
 */
export async function withRlsTransaction<T>(
  prisma: any,
  fn: (db: any) => Promise<T>,
  options?: { maxWait?: number; timeout?: number },
): Promise<T> {
  return await prisma.$transaction(async (db: any) => {
    const user = getRequest()?.user;

    if (user) {
      if (user.idir_user_guid) {
        await db.$executeRawUnsafe(
          `SET LOCAL jwt.claims.idir_user_guid = '${user.idir_user_guid.replaceAll("'", "''")}'`,
        );
      }
      if (user.client_roles) {
        const rolesString = Array.isArray(user.client_roles) ? user.client_roles.join(",") : user.client_roles;
        await db.$executeRawUnsafe(`SET LOCAL jwt.claims.client_roles = '${rolesString.replaceAll("'", "''")}'`);
      }
      // Default to 0 if exp is not set so that exp is less than the current time as if it were expired
      await db.$executeRawUnsafe(`SET LOCAL jwt.claims.exp = '${user.exp ?? 0}'`);
    }

    return await inTransactionContext.run(true, () => fn(db));
  }, options);
}
