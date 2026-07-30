import { Test, TestingModule } from "@nestjs/testing";
import { SexCodeResolver } from "./sex_code.resolver";
import { SexCodeService } from "./sex_code.service";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

describe("SexCodeResolver", () => {
  let resolver: SexCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleShared],
      providers: [SexCodeResolver, SexCodeService],
    }).compile();

    resolver = await module.resolve<SexCodeResolver>(SexCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
