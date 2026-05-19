import { Module } from "@nestjs/common";
import { SharedPrismaService } from "./prisma.shared.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/shared"; // NOSONAR
import createPgSessionExtension from "../../pg-session-extension/prisma-pg-session-extension";
import { CASE_FILE_RLS_MODELS } from "../../pg-session-extension/rls-protected-models";
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: SharedPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          transactionOptions: { maxWait: 10000, timeout: 30000 },
        });
        return client.$extends(createPgSessionExtension(client, CASE_FILE_RLS_MODELS)).$extends(createRetryExtension());
      },
    },
  ],
  exports: [SharedPrismaService],
})
export class PrismaModuleShared {}
