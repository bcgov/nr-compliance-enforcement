import { Prisma } from "@prisma/client/extension";
import { Logger } from "@nestjs/common";

const logger = new Logger("PrismaRetryExtension");

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 100;

// Prisma error codes that appear on error.code (PrismaClientKnownRequestError)
const RETRYABLE_ERROR_CODES = [
  "P1017", // Server has closed the connection
  "08P01", // Connection slots exhausted
];

function isRetryableError(error: any): boolean {
  if (RETRYABLE_ERROR_CODES.includes(error?.code)) return true;
  if (typeof error?.message === "string") {
    return RETRYABLE_ERROR_CODES.some((code) => error.message.includes(code));
  }
  return false;
}

async function withRetry<T>(operation: string, query: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await query();
    } catch (error: any) {
      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        lastError = error;
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
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
