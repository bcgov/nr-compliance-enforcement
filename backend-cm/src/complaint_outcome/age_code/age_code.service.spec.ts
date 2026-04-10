import { Test, TestingModule } from "@nestjs/testing";
import { AgeCodeService } from "./age_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("AgeCodeService", () => {
  let service: AgeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [AgeCodeService],
    }).compile();

    service = await module.resolve<AgeCodeService>(AgeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
