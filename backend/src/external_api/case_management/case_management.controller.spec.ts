import { Test, TestingModule } from "@nestjs/testing";
import { CaseManangementController } from "./case_management.controller";
import { CaseManangementService } from "./case_management.service";
import { HttpModule } from "@nestjs/axios";

describe("CaseManangmentController", () => {
  let controller: CaseManangementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseManangementController],
      providers: [CaseManangementService],
      imports: [HttpModule],
    }).compile();

    controller = module.get<CaseManangementController>(CaseManangementController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
