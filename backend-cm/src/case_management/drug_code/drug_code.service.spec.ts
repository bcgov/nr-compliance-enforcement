import { Test, TestingModule } from "@nestjs/testing";
import { DrugCodeService } from "./drug_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("DrugCodeService", () => {
  let service: DrugCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [DrugCodeService],
    }).compile();

    service = module.get<DrugCodeService>(DrugCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
