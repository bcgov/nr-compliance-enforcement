import { Test, TestingModule } from "@nestjs/testing";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { HWCRPreventionActionResolver } from "./hwcr_prevention_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";

describe("ActionTypeActionXrefResolver", () => {
  let resolver: HWCRPreventionActionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [HWCRPreventionActionResolver, ActionCodeService],
    }).compile();

    resolver = module.get<HWCRPreventionActionResolver>(HWCRPreventionActionResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
