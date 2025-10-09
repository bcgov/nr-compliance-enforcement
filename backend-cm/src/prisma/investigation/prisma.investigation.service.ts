import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import { postgisExtension } from "./extensions/postgis.extension";

// Create an instance to infer the type of the extended client
const extendedPrismaClient = new PrismaClient().$extends(postgisExtension);
export type ExtendedPrismaClient = typeof extendedPrismaClient;

/**
 * Investigation Prisma Service with PostGIS extension
 *
 * Note: This service uses a factory provider pattern (see module) to apply
 * the PostGIS extension. This is different from other Prisma services that
 * don't require extensions and can use simpler patterns.
 *
 * At runtime, instances will be ExtendedPrismaClient which includes
 * all the PostGIS extension methods.
 */
@Injectable()
export class InvestigationPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
