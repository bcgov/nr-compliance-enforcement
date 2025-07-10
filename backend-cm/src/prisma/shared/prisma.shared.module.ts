import { Module } from "@nestjs/common";
import { SharedPrismaService } from "./prisma.shared.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/shared"; // NOSONAR

@Module({
  providers: [
    {
      provide: SharedPrismaService,
      useValue: new PrismaClient(), // Initialize the Prisma client for case management
    },
  ],
  exports: [SharedPrismaService],
})
export class PrismaModuleShared {}
