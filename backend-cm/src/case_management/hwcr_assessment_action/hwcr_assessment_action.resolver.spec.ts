import { Test, TestingModule } from "@nestjs/testing";
import { HWCRAssessmentActionResolver } from "./hwcr_assessment_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ActionTypeActionXrefResolver", () => {
  let resolver: HWCRAssessmentActionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [HWCRAssessmentActionResolver, ActionCodeService],
    }).compile();

    resolver = module.get<HWCRAssessmentActionResolver>(HWCRAssessmentActionResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
