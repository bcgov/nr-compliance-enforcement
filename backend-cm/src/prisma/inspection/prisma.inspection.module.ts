import { Module } from "@nestjs/common";
import { InspectionPrismaService } from "./prisma.inspection.service";

//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/inspection"; // NOSONAR
import createRetryExtension from "../prisma-retry-extension";
import { withPoolParams } from "../with-pool-params";

@Module({
  providers: [
    {
      provide: InspectionPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          datasources: { db: { url: withPoolParams(process.env.INSPECTION_POSTGRES_URL ?? "") } },
        });
        return client.$extends(createRetryExtension());
      },
    },
  ],
  exports: [InspectionPrismaService],
})
export class PrismaModuleInspection {}
