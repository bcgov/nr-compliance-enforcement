import { Test, TestingModule } from "@nestjs/testing";
import { DrugRemainingOutcomeCodeResolver } from "./drug_remaining_outcome_code.resolver";
import { DrugRemainingOutcomeCodeService } from "./drug_remaining_outcome_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
describe("DrugRemainingOutcomeCodeResolver", () => {
  let resolver: DrugRemainingOutcomeCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [DrugRemainingOutcomeCodeResolver, DrugRemainingOutcomeCodeService],
    }).compile();

    resolver = module.get<DrugRemainingOutcomeCodeResolver>(DrugRemainingOutcomeCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
