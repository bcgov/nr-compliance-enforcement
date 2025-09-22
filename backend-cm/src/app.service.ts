import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "./prisma/complaint_outcome/prisma.complaint_outcome.service";

@Injectable()
export class AppService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

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
