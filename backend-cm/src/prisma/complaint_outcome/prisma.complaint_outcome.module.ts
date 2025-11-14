import { Module } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma.complaint_outcome.service";
import { PrismaClient } from ".prisma/complaint_outcome";

@Module({
  providers: [
    {
      provide: ComplaintOutcomePrismaService,
      useValue: new PrismaClient(), // Initialize the Prisma client for case management
      // To use the pg sessions extension for RLS, replace the useValue with:
      /**
      useFactory: () => {
        const client = new PrismaClient();
        return client.$extends(createPgSessionExtension(client));
      },
       */
    },
  ],
  exports: [ComplaintOutcomePrismaService],
})
export class PrismaModuleComplaintOutcome {}
