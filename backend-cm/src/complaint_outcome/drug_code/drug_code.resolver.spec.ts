import { Test, TestingModule } from "@nestjs/testing";
import { DrugCodeResolver } from "./drug_code.resolver";
import { DrugCodeService } from "./drug_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("DrugCodeResolver", () => {
  let resolver: DrugCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [DrugCodeResolver, DrugCodeService],
    }).compile();

    resolver = module.get<DrugCodeResolver>(DrugCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
