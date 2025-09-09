import { Module } from "@nestjs/common";
import { InspectionPrismaService } from "./prisma.inspection.service";

//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/inspection"; // NOSONAR

@Module({
  providers: [
    {
      provide: InspectionPrismaService,
      useValue: new PrismaClient(), // Initialize the Prisma client for inspection
    },
  ],
  exports: [InspectionPrismaService],
})
export class PrismaModuleInspection {}
