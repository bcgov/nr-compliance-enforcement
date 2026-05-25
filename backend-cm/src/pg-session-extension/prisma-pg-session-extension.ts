import { Prisma } from "@prisma/client/extension";
import { Logger } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { getRequest } from "./request-interceptor";
import { setRlsClaims } from "./set-rls-claims";

const logger = new Logger("PgSessionExtension");

/**
 * Set to true while a transaction is in progress that has already set the JWT claims
 * via withRlsTransaction. This will then skip the pg-session wrap so they don't open
 * multiple independant nested transactions
 */
export const inTransactionContext = new AsyncLocalStorage<boolean>();

// Set to true to deliberately run reads WITHOUT JWT claims bypassing RLS
export const rlsBypassContext = new AsyncLocalStorage<boolean>();

// Only reads get wrapped in a claims-bearing transaction as the policies are only set for reads
const READ_OPERATIONS = new Set([
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

/**
 * createPgSessionExtension is a factory that returns a Prisma extension that sets the
 * JWT claims as session variables within a PG transaction and executes the original query
 * within that transaction. This allows PG to use the users roles and id to assess RLS policies.
 * Prisma extensions are not able to access the client directly, so the client is passed in using
 * a factory function.
 */
function createPgSessionExtension(client: any, protectedModels: Set<string>) {
  return Prisma.defineExtension({
    name: "pgSessionExtension",
    query: {
      $allModels: {
        async $allOperations(params) {
          const { args, query, model, operation } = params;

          if (!operation || !READ_OPERATIONS.has(operation)) return query(args);
          if (!model || !protectedModels.has(model)) return query(args);
          if (inTransactionContext.getStore()) return query(args);
          if (rlsBypassContext.getStore()) return query(args);

          const user = getRequest()?.user;
          if (!user) return query(args);

          try {
            return await client.$transaction(
              async (tx: any) => {
                await setRlsClaims(tx, user);
                return await tx[model][operation](args);
              },
              { maxWait: 10000, timeout: 30000 },
            );
          } catch (error) {
            logger.error(
              `Failed to execute query with JWT claims for ${model}.${operation}: ${error?.message ?? error}`,
              error?.stack,
            );
            throw new Error(`[pgSessionExtension] Failed to execute query with JWT claims for ${model}.${operation}`, {
              cause: error,
            });
          }
        },
      },
    },
  });
}

export default createPgSessionExtension;
