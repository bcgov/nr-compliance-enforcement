import { getRequest } from "./request-interceptor";
import { inTransactionContext } from "./prisma-pg-session-extension";
import { setRlsClaims } from "./set-rls-claims";

// Runs inside a Prisma transaction with the users JWT claims set once. Sets inTransactionContext
// so the pg-session extension doesn't add claims for nested transactions.
export async function withRlsTransaction<T>(
  prisma: any,
  fn: (db: any) => Promise<T>,
  options?: { maxWait?: number; timeout?: number },
): Promise<T> {
  return await prisma.$transaction(async (db: any) => {
    await setRlsClaims(db, getRequest()?.user);
    return await inTransactionContext.run(true, () => fn(db));
  }, options);
}
