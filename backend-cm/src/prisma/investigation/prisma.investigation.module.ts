import { Module } from "@nestjs/common";
import { InvestigationPrismaService } from "./prisma.investigation.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: InvestigationPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          transactionOptions: { maxWait: 10000, timeout: 30000 },
        });
        return client.$extends(createRetryExtension());
      },
    },
  ],
  exports: [InvestigationPrismaService],
})
export class PrismaModuleInvestigation {}