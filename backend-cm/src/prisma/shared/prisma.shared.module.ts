import { Module } from "@nestjs/common";
import { SharedPrismaService } from "./prisma.shared.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/shared"; // NOSONAR
import createRetryExtension from "../prisma-retry-extension";

@Module({
  providers: [
    {
      provide: SharedPrismaService,
      useFactory: () => {
        const client = new PrismaClient();
        return client.$extends(createRetryExtension());
      },
    },
  ],
  exports: [SharedPrismaService],
})
export class PrismaModuleShared {}
