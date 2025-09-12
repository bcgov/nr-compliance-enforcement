import { Test, TestingModule } from "@nestjs/testing";
import { SexCodeService } from "./sex_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("SexCodeService", () => {
  let service: SexCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [SexCodeService],
    }).compile();

    service = module.get<SexCodeService>(SexCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
