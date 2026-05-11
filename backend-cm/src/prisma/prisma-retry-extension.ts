import { Prisma } from "@prisma/client/extension";
import { Logger } from "@nestjs/common";

const logger = new Logger("PrismaRetryExtension");

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 200;
const MAX_DELAY_MS = 5000;

// Prisma error codes that appear on error
const RETRYABLE_ERROR_CODES = [
  "P1017", // Server has closed the connection
  "P2024", // Timed out fetching a new connection from the pool
  "P2028", // Transaction API error / transaction expired
  "08P01", // Connection slots exhausted
];

// Codes that specifically indicate pool starvation
const POOL_STARVATION_CODES = new Set([
  "P2024", // Timed out fetching a connection from Prisma's local pool
  "08P01", // Postgres: connection slots exhausted
  "53300", // Postgres SQLSTATE: too_many_connections
]);

function getErrorCode(error: any): string | undefined {
  return error?.code ?? error?.cause?.code;
}

function isRetryableError(error: any): boolean {
  // pg-session extension wraps Prisma errors so the error code lives on .cause for those
  const code = getErrorCode(error);
  if (RETRYABLE_ERROR_CODES.includes(code as string)) return true;
  const message = error?.message ?? error?.cause?.message;
  if (typeof message === "string") {
    return RETRYABLE_ERROR_CODES.some((c) => message.includes(c));
  }
  return false;
}

async function withRetry<T>(operation: string, query: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await query();
    } catch (error: any) {
      const code = getErrorCode(error);

      if (POOL_STARVATION_CODES.has(code as string)) {
        logger.warn(`POOL_STARVATION operation=${operation} code=${code} attempt=${attempt + 1}`);
      }

      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        lastError = error;
        const exp = BASE_DELAY_MS * Math.pow(2, attempt);
        // Random backoff so parallel retries don't all execute at once
        const delay = Math.min(MAX_DELAY_MS, Math.round(exp * (0.5 + Math.random()))); // NOSONAR
        logger.warn(
          `Connection error on ${operation} (${error.code ?? "unknown"}), retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

/**
 * Creates a Prisma extension that retries queries on connection errors
 * with exponential backoff.
 */
function createRetryExtension() {
  return Prisma.defineExtension({
    name: "retryExtension",
    query: {
      $allModels: {
        async $allOperations(params) {
          const { args, query, model, operation } = params;
          return withRetry(`${model}.${operation}`, () => query(args));
        },
      },
      async $queryRaw({ args, query }) {
        return withRetry("$queryRaw", () => query(args));
      },
      async $queryRawUnsafe({ args, query }) {
        return withRetry("$queryRawUnsafe", () => query(args));
      },
      async $executeRaw({ args, query }) {
        return withRetry("$executeRaw", () => query(args));
      },
      async $executeRawUnsafe({ args, query }) {
        return withRetry("$executeRawUnsafe", () => query(args));
      },
    },
  });
}

export default createRetryExtension;
