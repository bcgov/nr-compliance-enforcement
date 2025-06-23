import { Module } from "@nestjs/common";
import { CaseManagementPrismaService } from "./prisma.cm.service";
import { PrismaClient } from ".prisma/case_management";

@Module({
  providers: [
    {
      provide: CaseManagementPrismaService,
      useValue: new PrismaClient(), // Initialize the Prisma client for case management
    },
  ],
  exports: [CaseManagementPrismaService],
})
export class PrismaModuleCaseManagement {}
