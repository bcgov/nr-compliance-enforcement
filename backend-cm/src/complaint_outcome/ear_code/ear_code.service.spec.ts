import { Test, TestingModule } from "@nestjs/testing";
import { EarCodeService } from "./ear_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("EarCodeService", () => {
  let service: EarCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [EarCodeService],
    }).compile();

    service = module.get<EarCodeService>(EarCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
