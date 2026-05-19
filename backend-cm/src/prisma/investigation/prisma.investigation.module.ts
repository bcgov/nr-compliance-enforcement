import { Module } from "@nestjs/common";
import { InvestigationPrismaService } from "./prisma.investigation.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import createPgSessionExtension from "../../pg-session-extension/prisma-pg-session-extension";
import { INVESTIGATION_RLS_MODELS } from "../../pg-session-extension/rls-protected-models";
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: InvestigationPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          transactionOptions: { maxWait: 10000, timeout: 30000 },
        });
        return client
          .$extends(createPgSessionExtension(client, INVESTIGATION_RLS_MODELS))
          .$extends(createRetryExtension());
      },
    },
  ],
  exports: [InvestigationPrismaService],
})
export class PrismaModuleInvestigation {}
