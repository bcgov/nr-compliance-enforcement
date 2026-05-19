import { Module } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma.complaint_outcome.service";
import { PrismaClient } from ".prisma/complaint_outcome";
import createPgSessionExtension from "../../pg-session-extension/prisma-pg-session-extension";
import { COMPLAINT_OUTCOME_RLS_MODELS } from "../../pg-session-extension/rls-protected-models";
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: ComplaintOutcomePrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          transactionOptions: { maxWait: 10000, timeout: 30000 },
        });
        return client
          .$extends(createPgSessionExtension(client, COMPLAINT_OUTCOME_RLS_MODELS))
          .$extends(createRetryExtension());
      },
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
