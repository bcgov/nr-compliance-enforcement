import { Module } from "@nestjs/common";
import { SharedPrismaService } from "./prisma.shared.service";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/shared"; // NOSONAR
import createRetryExtension from "../prisma-retry-extension";
import { withPoolParams } from "../with-pool-params";

@Module({
  providers: [
    {
      provide: SharedPrismaService,
      useFactory: () => {
        const client = new PrismaClient({
          datasources: { db: { url: withPoolParams(process.env.SHARED_POSTGRES_URL ?? "") } },
        });
        return client.$extends(createRetryExtension());
      },
    },
  ],
  exports: [SharedPrismaService],
})
export class PrismaModuleShared {}
