import { Prisma } from "@prisma/client/extension";
import { getRequest } from "./request-interceptor";

/**
 * createPgSessionExtension is a factory that returns a Prisma extension that sets the
 * JWT claims as session variables within a PG transaction and executes the original query
 * within that transaction. This allows PG to use the users roles and id to assess RLS policies.
 * Prisma extensions are not able to access the client directly, so the client is passed in using
 * a factory function.
 */
function createPgSessionExtension(client: any) {
  return Prisma.defineExtension({
    name: "pgSessionExtension", // Optional: name appears in error logs
    query: {
      $allModels: {
        async $allOperations(params) {
          const { args, query } = params;
          const model = params.model as string | undefined;
          const operation = params.operation as string | undefined;

          const readOperations = new Set([
            "findUnique",
            "findUniqueOrThrow",
            "findFirst",
            "findFirstOrThrow",
            "findMany",
            "count",
            "aggregate",
            "groupBy",
            "queryRaw",
            "$queryRaw",
            "queryRawUnsafe",
            "$queryRawUnsafe",
            "findRaw",
            "aggregateRaw",
          ]);

          // Only setup the PG sessions with JWT claims for read operations.
          // This allows mutations to take advantage of transactions without
          // being nested, which prisma has been known to have troubles with
          if (!operation || !readOperations.has(operation)) {
            return query(args);
          }

          // Try to get the user from the request context from the AsyncLocalStorage
          const request = getRequest();
          const user = request?.user;

          // If there's no user, attempt to execute the query normally
          if (!user) {
            return query(args);
          }

          try {
            let rolesString: string | null = null;
            if (user.client_roles) {
              // Join roles with comma instead of JSON stringify to avoid double encoding
              rolesString = Array.isArray(user.client_roles) ? user.client_roles.join(",") : user.client_roles;
            }

            const batch: any[] = [
              ...(user.idir_user_guid
                ? [
                    client.$executeRawUnsafe(
                      `SET LOCAL jwt.claims.idir_user_guid = '${user.idir_user_guid.replaceAll("'", "''")}'`,
                    ),
                  ]
                : []),
              ...(rolesString
                ? [
                    client.$executeRawUnsafe(
                      `SET LOCAL jwt.claims.client_roles = '${rolesString.replaceAll("'", "''")}'`,
                    ),
                  ]
                : []),
              // Default to 0 if exp is not set so that exp is less than the current time as if it were expired
              client.$executeRawUnsafe(`SET LOCAL jwt.claims.exp = '${user.exp ?? 0}'`),
              query(args),
            ];

            const results = await client.$transaction(batch);
            return results[results.length - 1];
          } catch (error) {
            throw new Error(
              `[pgSessionExtension] Failed to execute query with JWT claims for ${model}.${operation}`,
              error,
            );
          }
        },
      },
    },
  });
}

export default createPgSessionExtension;
