import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ComplaintOutcomePrismaService } from "./prisma/complaint_outcome/prisma.complaint_outcome.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ComplaintOutcomePrismaService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello from Emerald!"', () => {
      expect(appController.getHello()).toBe("Hello from Emerald!");
    });
  });
});
