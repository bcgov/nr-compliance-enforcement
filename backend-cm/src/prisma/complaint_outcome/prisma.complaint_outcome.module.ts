import { Module } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma.complaint_outcome.service";
import { PrismaClient } from ".prisma/complaint_outcome";

@Module({
  providers: [
    {
      provide: ComplaintOutcomePrismaService,
      useValue: new PrismaClient(), // Initialize the Prisma client for case management
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
