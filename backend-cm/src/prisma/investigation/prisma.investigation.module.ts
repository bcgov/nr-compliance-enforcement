import { Module } from "@nestjs/common";
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

        // Add lifecycle hooks to the extended client
        // TypeScript doesn't know about these properties on the extended client
        type ExtendedClient = typeof extended & {
          onModuleInit?: () => Promise<void>;
          onModuleDestroy?: () => Promise<void>;
        };

        const extendedWithLifecycle = extended as ExtendedClient;

        extendedWithLifecycle.onModuleInit = async () => {
          await client.$connect();
        };

        extendedWithLifecycle.onModuleDestroy = async () => {
          await client.$disconnect();
        };

        return extendedWithLifecycle as unknown as InvestigationPrismaService;
      },
    },
  ],
  exports: [InvestigationPrismaService],
})
export class PrismaModuleInvestigation {}
