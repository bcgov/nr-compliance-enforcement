import { Prisma } from "@prisma/client/extension";
import { Logger } from "@nestjs/common";

const logger = new Logger("PrismaRetryExtension");

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 100;

/**
 * Creates a Prisma extension that retries queries on P1017 "Server has closed the connection"
 * errors with exponential backoff.
 */
function createRetryExtension() {
  return Prisma.defineExtension({
    name: "retryExtension",
    query: {
      $allModels: {
        async $allOperations(params) {
          const { args, query, model, operation } = params;

          let lastError: unknown;
          for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
              return await query(args);
            } catch (error: any) {
              if (error?.code === "P1017" && attempt < MAX_RETRIES) {
                lastError = error;
                const delay = BASE_DELAY_MS * Math.pow(2, attempt);
                logger.warn(
                  `P1017 connection error on ${model}.${operation}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
              }
              throw error;
            }
          }
          throw lastError;
        },
      },
    },
  });
}

export default createRetryExtension;
