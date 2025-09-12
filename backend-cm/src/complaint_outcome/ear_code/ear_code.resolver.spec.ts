import { Test, TestingModule } from "@nestjs/testing";
import { EarCodeResolver } from "./ear_code.resolver";
import { EarCodeService } from "./ear_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("EarCodeResolver", () => {
  let resolver: EarCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [EarCodeResolver, EarCodeService],
    }).compile();

    resolver = module.get<EarCodeResolver>(EarCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
