import { Test, TestingModule } from "@nestjs/testing";
import { AgeCodeResolver } from "./age_code.resolver";
import { AgeCodeService } from "./age_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("AgeCodeResolver", () => {
  let resolver: AgeCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [AgeCodeResolver, AgeCodeService],
    }).compile();

    resolver = module.get<AgeCodeResolver>(AgeCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
