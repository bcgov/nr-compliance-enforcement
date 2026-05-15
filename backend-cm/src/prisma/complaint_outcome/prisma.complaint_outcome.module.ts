import { Module } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma.complaint_outcome.service";
import { PrismaClient } from ".prisma/complaint_outcome";
import createPgSessionExtension from "../../pg-session-extension/prisma-pg-session-extension";
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: ComplaintOutcomePrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          transactionOptions: { maxWait: 10000, timeout: 30000 },
        });
        return client.$extends(createPgSessionExtension(client)).$extends(createRetryExtension());
      },
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
