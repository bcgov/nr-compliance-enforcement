import { Test, TestingModule } from "@nestjs/testing";
import { DrugMethodCodeService } from "./drug_method_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("DrugMethodCodeService", () => {
  let service: DrugMethodCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [DrugMethodCodeService],
    }).compile();

    service = module.get<DrugMethodCodeService>(DrugMethodCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
