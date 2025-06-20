import { Test, TestingModule } from "@nestjs/testing";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { HWCRPreventionActionResolver } from "./hwcr_prevention_action.resolver";
import { ActionCodeService } from "../action_code/action_code.service";

describe("ActionTypeActionXrefResolver", () => {
  let resolver: HWCRPreventionActionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [HWCRPreventionActionResolver, ActionCodeService],
    }).compile();

    resolver = module.get<HWCRPreventionActionResolver>(HWCRPreventionActionResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
