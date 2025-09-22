import { Test, TestingModule } from "@nestjs/testing";
import { InactionJustificationTypeService } from "./inaction_justification_type.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("InactionReasonCodeService", () => {
  let service: InactionJustificationTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [InactionJustificationTypeService],
    }).compile();

    service = module.get<InactionJustificationTypeService>(InactionJustificationTypeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
