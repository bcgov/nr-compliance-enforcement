import { Test, TestingModule } from "@nestjs/testing";
import { SexCodeResolver } from "./sex_code.resolver";
import { SexCodeService } from "./sex_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("SexCodeResolver", () => {
  let resolver: SexCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [SexCodeResolver, SexCodeService],
    }).compile();

    resolver = module.get<SexCodeResolver>(SexCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
