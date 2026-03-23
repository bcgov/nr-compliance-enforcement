import { Module } from "@nestjs/common";
import { InspectionPrismaService } from "./prisma.inspection.service";

//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/inspection"; // NOSONAR
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: InspectionPrismaService,
      useFactory: () => {
        const client = new PrismaClient();
        return client.$extends(createRetryExtension());
      },
    },
  ],
  exports: [InspectionPrismaService],
})
export class PrismaModuleInspection {}
