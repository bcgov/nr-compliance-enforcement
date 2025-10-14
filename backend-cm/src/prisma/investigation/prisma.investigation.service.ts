import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import { postgisExtension } from "./extensions/postgis.extension";

// Create an instance to infer the type of the extended client and export it for use elsewhere
const extendedPrismaClient = new PrismaClient().$extends(postgisExtension);
export type ExtendedPrismaClient = typeof extendedPrismaClient;

@Injectable()
export class InvestigationPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
