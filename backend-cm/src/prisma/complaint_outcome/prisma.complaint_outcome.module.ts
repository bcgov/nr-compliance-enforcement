import { Module } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma.complaint_outcome.service";
import { PrismaClient } from ".prisma/complaint_outcome";
import createPgSessionExtension from "../../pg-session-extension/prisma-pg-session-extension";
import createRetryExtension from "../prisma-retry-extension";
import { withPoolParams } from "../with-pool-params";

@Module({
  providers: [
    {
      provide: ComplaintOutcomePrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          datasources: { db: { url: withPoolParams(process.env.COMPLAINT_OUTCOME_POSTGRES_URL ?? "") } },
        });
        return client.$extends(createPgSessionExtension(client)).$extends(createRetryExtension());
      },
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
