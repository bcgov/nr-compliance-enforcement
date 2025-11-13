import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR

@Injectable()
export class InvestigationPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}