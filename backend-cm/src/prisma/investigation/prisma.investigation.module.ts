import { Module } from "@nestjs/common";
import { InvestigationPrismaService } from "./prisma.investigation.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR

@Module({
  providers: [
    {
      provide: InvestigationPrismaService,
      useValue: new PrismaClient(), // Initialize the Prisma client for investigation
    },
  ],
  exports: [InvestigationPrismaService],
})
export class PrismaModuleInvestigation {}