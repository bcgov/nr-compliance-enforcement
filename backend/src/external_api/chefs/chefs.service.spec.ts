import { Test, TestingModule } from "@nestjs/testing";
import { ChefsService } from "./chefs.service";

describe("ChefsService", () => {
  let service: ChefsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChefsService],
    }).compile();

    service = await module.resolve<ChefsService>(ChefsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
