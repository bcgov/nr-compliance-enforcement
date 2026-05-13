import { Module } from "@nestjs/common";
import { InspectionPrismaService } from "./prisma.inspection.service";

//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/inspection"; // NOSONAR
import createPgSessionExtension from "../../pg-session-extension/prisma-pg-session-extension";
import { INSPECTION_RLS_MODELS } from "../../pg-session-extension/rls-protected-models";
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: InspectionPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          transactionOptions: { maxWait: 10000, timeout: 30000 },
        });
        return client
          .$extends(createPgSessionExtension(client, INSPECTION_RLS_MODELS))
          .$extends(createRetryExtension());
      },
    },
  ],
  exports: [InspectionPrismaService],
})
export class PrismaModuleInspection {}
