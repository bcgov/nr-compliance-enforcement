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
        const client = new PrismaClient();
        return client.$extends(createPgSessionExtension(client)).$extends(createRetryExtension());
      },
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
