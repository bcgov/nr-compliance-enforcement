import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventProcessorService } from "./event-processor/event-processor.service";
import { ServiceUnavailableException } from "@nestjs/common";

describe("AppController", () => {
  let appController: AppController;
  let eventProcessor: { pingNats: jest.Mock };

  beforeEach(async () => {
    eventProcessor = { pingNats: jest.fn().mockResolvedValue(undefined) };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: EventProcessorService, useValue: eventProcessor }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe("Hello World!");
    });
  });

  describe("health", () => {
    it('should return "ok" when NATS responds', async () => {
      await expect(appController.health()).resolves.toBe("ok");
      expect(eventProcessor.pingNats).toHaveBeenCalledTimes(1);
    });

    it("should throw when NATS ping fails", async () => {
      eventProcessor.pingNats.mockRejectedValueOnce(new Error("offline"));

      await expect(appController.health()).rejects.toBeInstanceOf(ServiceUnavailableException);
    });
  });
});
