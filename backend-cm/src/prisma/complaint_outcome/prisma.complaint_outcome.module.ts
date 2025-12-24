import { Module } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma.complaint_outcome.service";
import { PrismaClient } from ".prisma/complaint_outcome";
import createPgSessionExtension from "src/pg-session-extension/prisma-pg-session-extension";

@Module({
  providers: [
    {
      provide: ComplaintOutcomePrismaService,
      useFactory: () => {
        const client = new PrismaClient();
        return client.$extends(createPgSessionExtension(client));
      },
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
