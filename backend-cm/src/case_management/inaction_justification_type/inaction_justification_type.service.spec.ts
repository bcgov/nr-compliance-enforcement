import { Test, TestingModule } from "@nestjs/testing";
import { InactionJustificationTypeService } from "./inaction_justification_type.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("InactionReasonCodeService", () => {
  let service: InactionJustificationTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [InactionJustificationTypeService],
    }).compile();

    service = module.get<InactionJustificationTypeService>(InactionJustificationTypeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
