import { Module, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { InvestigationPrismaService } from "./prisma.investigation.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import { postgisExtension } from "./extensions/postgis.extension";

@Module({
  providers: [
    {
      provide: InvestigationPrismaService,
      useFactory: () => {
        const client = new PrismaClient();
        const extended = client.$extends(postgisExtension);

        // Add lifecycle methods
        (extended as any).onModuleInit = async () => {
          await client.$connect();
        };

        (extended as any).onModuleDestroy = async () => {
          await client.$disconnect();
        };

        return extended as any as InvestigationPrismaService;
      },
    },
  ],
  exports: [InvestigationPrismaService],
})
export class PrismaModuleInvestigation {}
