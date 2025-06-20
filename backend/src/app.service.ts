import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}
  getHello(): string {
    return "Hello Backend!";
  }

  // return Success if able to Select 1 from database.
  async getDBHealthCheck(): Promise<string> {
    try {
      await this.dataSource.query("SELECT 1");
      return "Success";
    } catch (error) {
      return "Failure";
    }
  }
}
