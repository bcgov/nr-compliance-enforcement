import { Test, TestingModule } from "@nestjs/testing";
import { DrugMethodCodeResolver } from "./drug_method_code.resolver";
import { DrugMethodCodeService } from "./drug_method_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("DrugMethodCodeResolver", () => {
  let resolver: DrugMethodCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [DrugMethodCodeResolver, DrugMethodCodeService],
    }).compile();

    resolver = module.get<DrugMethodCodeResolver>(DrugMethodCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
