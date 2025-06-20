import { Test, TestingModule } from "@nestjs/testing";
import { EarCodeResolver } from "./ear_code.resolver";
import { EarCodeService } from "./ear_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("EarCodeResolver", () => {
  let resolver: EarCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [EarCodeResolver, EarCodeService],
    }).compile();

    resolver = module.get<EarCodeResolver>(EarCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
