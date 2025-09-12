import { Test, TestingModule } from "@nestjs/testing";
import { DrugMethodCodeResolver } from "./drug_method_code.resolver";
import { DrugMethodCodeService } from "./drug_method_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("DrugMethodCodeResolver", () => {
  let resolver: DrugMethodCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [DrugMethodCodeResolver, DrugMethodCodeService],
    }).compile();

    resolver = module.get<DrugMethodCodeResolver>(DrugMethodCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
