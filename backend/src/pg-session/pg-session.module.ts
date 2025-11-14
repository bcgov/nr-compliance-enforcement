import { Module, Global, OnModuleInit, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RequestInterceptor, getRequest } from "./request-interceptor";

/**
 * PgSessionModule is used to wrap all of the read queries to the database in a transaction
 * with the users JWT claims.
 */
@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
  ],
})
export class PgSessionModule implements OnModuleInit {
  private readonly logger = new Logger(PgSessionModule.name);

  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    this.logger.log("Initializing PgSessionModule");
    // Grab the original methods to either wrap or fallback to
    const originalDataSourceQuery = this.dataSource.query.bind(this.dataSource);
    const originalManagerQuery = this.dataSource.manager.query.bind(this.dataSource.manager);
    const originalCreateQueryRunner = this.dataSource.createQueryRunner.bind(this.dataSource);
    const logger = this.logger; // Capture logger reference for use in the bound function
    const dataSource = this.dataSource; // Capture DataSource reference for use in bound functions

    // Helper function to wrap a query in a transaction with JWT claims
    const wrapQueryInTransaction = async <T = any>(
      query: string,
      parameters: any[] | undefined,
      originalQueryFn: (query: string, parameters?: any[], queryRunner?: any) => Promise<T>,
      dataSource: DataSource,
    ): Promise<T> => {
      // Only wrap read operations in transactions
      const formattedSql = query.trim().toUpperCase();
      const isReadOperation =
        formattedSql.startsWith("SELECT") ||
        formattedSql.startsWith("WITH") ||
        formattedSql.startsWith("EXPLAIN") ||
        formattedSql.startsWith("SHOW") ||
        formattedSql.startsWith("TABLE") ||
        formattedSql.startsWith("DESC");

      if (!isReadOperation) {
        return originalQueryFn(query, parameters);
      }

      // If there's no user, execute the query normally
      const request = getRequest();
      if (!request?.user) {
        return originalQueryFn(query, parameters);
      }

      // Log that we're wrapping a read query in a transaction
      logger.debug(`Wrapping read query in transaction for user: ${request.user.idir_username || "unknown"}`);

      try {
        // Create a query runner and start a transaction
        const runner = dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();

        try {
          // Set JWT claims in the transaction session
          const user = request.user;
          if (user.idir_user_guid) {
            await runner.query(`SET LOCAL jwt.claims.idir_user_guid = '${user.idir_user_guid.replaceAll(/'/g, "''")}'`);
          }
          if (user.client_roles) {
            const rolesString = Array.isArray(user.client_roles) ? user.client_roles.join(",") : user.client_roles;
            await runner.query(`SET LOCAL jwt.claims.client_roles = '${rolesString.replaceAll(/'/g, "''")}'`);
          }
          if (user.idir_user_guid) {
            // Default to 0 if exp is not set so that exp is less than the current time as if it were expired
            await runner.query(`SET LOCAL jwt.claims.exp = '${user.exp ?? 0}'`);
          }

          // Execute the original query with the transaction
          const result = await originalQueryFn(query, parameters, runner);

          // Commit the transaction
          await runner.commitTransaction();

          return result;
        } catch (error) {
          // Rollback on error
          await runner.rollbackTransaction();
          logger.error("Failed to set JWT claims in transaction:", error);
          throw error;
        } finally {
          // Release the query runner
          await runner.release();
        }
      } catch (error) {
        logger.warn("Failed to execute query with JWT claims:", error);
        // Fallback to normal execution
        return originalQueryFn(query, parameters);
      }
    };

    // Override the DataSource's query method
    this.dataSource.query = async function <T = any>(query: string, parameters?: any[], queryRunner?: any): Promise<T> {
      // If a queryRunner is provided, use it directly
      if (queryRunner) {
        return originalDataSourceQuery(query, parameters, queryRunner);
      }

      return wrapQueryInTransaction(query, parameters, originalDataSourceQuery, this);
    }.bind(this.dataSource);

    // Override the EntityManager's query method (used by QueryBuilder)
    this.dataSource.manager.query = async function <T = any>(
      query: string,
      parameters?: any[],
      queryRunner?: any,
    ): Promise<T> {
      // If a queryRunner is provided, use it directly
      if (queryRunner) {
        return originalManagerQuery(query, parameters, queryRunner);
      }

      return wrapQueryInTransaction(query, parameters, originalManagerQuery, dataSource);
    }.bind(this.dataSource.manager);

    // Override createQueryRunner to wrap QueryRunner's query method
    // This is critical because TypeORM QueryBuilder creates its own QueryRunner
    this.dataSource.createQueryRunner = function (mode?: "master" | "slave") {
      const queryRunner = originalCreateQueryRunner(mode);
      const originalQueryRunnerQuery = queryRunner.query.bind(queryRunner);

      // Wrap the QueryRunner's query method
      queryRunner.query = async function <T = any>(
        query: string,
        parameters?: any[],
        useStructuredResult?: boolean,
      ): Promise<T> {
        logger.debug(`QueryRunner.query called: ${query.substring(0, 100)}...`);

        // Only wrap read operations in transactions if not already in a transaction
        const formattedSql = query.trim().toUpperCase();
        const isReadOperation =
          formattedSql.startsWith("SELECT") ||
          formattedSql.startsWith("WITH") ||
          formattedSql.startsWith("EXPLAIN") ||
          formattedSql.startsWith("SHOW") ||
          formattedSql.startsWith("TABLE") ||
          formattedSql.startsWith("DESC");

        // If it's not a read operation, or we're already in a transaction, execute normally
        if (!isReadOperation || this.isTransactionActive) {
          return originalQueryRunnerQuery(query, parameters, useStructuredResult);
        }

        // If there's no user, execute the query normally
        const request = getRequest();
        if (!request?.user) {
          return originalQueryRunnerQuery(query, parameters, useStructuredResult);
        }

        // Log that we're wrapping a read query in a transaction
        logger.debug(`Wrapping QueryRunner query in transaction for user: ${request.user.idir_username || "unknown"}`);

        // Check if we're already in a transaction
        const wasInTransaction = this.isTransactionActive;
        let transactionStarted = false;

        try {
          // Start a transaction if not already in one
          if (!wasInTransaction) {
            await this.connect();
            await this.startTransaction();
            transactionStarted = true;
          }

          try {
            // Set JWT claims in the transaction session
            const user = request.user;
            if (user.idir_username) {
              logger.debug(`Setting JWT claim: idir_username = ${user.idir_username}`);
              await originalQueryRunnerQuery(
                `SET LOCAL jwt.claims.idir_username = '${user.idir_username.replace(/'/g, "''")}'`,
              );
            }
            if (user.idir_user_guid) {
              await originalQueryRunnerQuery(
                `SET LOCAL jwt.claims.idir_user_guid = '${user.idir_user_guid.replace(/'/g, "''")}'`,
              );
            }
            if (user.client_roles) {
              const rolesString = Array.isArray(user.client_roles) ? user.client_roles.join(",") : user.client_roles;
              await originalQueryRunnerQuery(
                `SET LOCAL jwt.claims.client_roles = '${rolesString.replace(/'/g, "''")}'`,
              );
            }

            // Execute the original query
            logger.debug(`Executing query in transaction: ${query.substring(0, 100)}...`);
            const result = await originalQueryRunnerQuery(query, parameters, useStructuredResult);

            // Commit the transaction if we started it
            if (transactionStarted) {
              await this.commitTransaction();
            }

            return result;
          } catch (error) {
            // Rollback on error if we started the transaction
            if (transactionStarted) {
              await this.rollbackTransaction();
            }
            logger.error("Failed to set JWT claims in transaction:", error);
            throw error;
          }
        } catch (error) {
          logger.warn("Failed to execute query with JWT claims:", error);
          // Fallback to normal execution
          return originalQueryRunnerQuery(query, parameters, useStructuredResult);
        }
      }.bind(queryRunner);

      return queryRunner;
    }.bind(this.dataSource);
  }
}
