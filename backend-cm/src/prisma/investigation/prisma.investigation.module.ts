import { Module } from "@nestjs/common";
import { InvestigationPrismaService } from "./prisma.investigation.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import createRetryExtension from "../prisma-retry-extension";
import { withPoolParams } from "../with-pool-params";

@Module({
  providers: [
    {
      provide: InvestigationPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          datasources: { db: { url: withPoolParams(process.env.INVESTIGATION_POSTGRES_URL ?? "") } },
        });
        return client.$extends(createRetryExtension());
      },
    },
  ],
  exports: [InvestigationPrismaService],
})
export class PrismaModuleInvestigation {}