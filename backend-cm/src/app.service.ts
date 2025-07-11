import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "./prisma/cm/prisma.cm.service";

@Injectable()
export class AppService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  getHello(): string {
    return "Hello from Emerald!";
  }

  async getDBHealthCheck(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return "Success";
    } catch (error) {
      return "Failure";
    }
  }
}
