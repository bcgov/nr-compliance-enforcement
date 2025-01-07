import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./auth/jwtauth.guard";
import { JwtRoleGuard } from "./auth/jwtrole.guard";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { DataSource } from "typeorm";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, DataSource],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello Backend!"', () => {
      expect(appController.getHello()).toBe("Hello Backend!");
    });
  });
});
