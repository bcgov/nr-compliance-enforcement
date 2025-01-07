import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello Backend!"', () => {
      expect(appController.getHello()).toBe("Hello Backend!");
    });
  });
});
