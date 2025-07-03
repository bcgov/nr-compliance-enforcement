import { Test, TestingModule } from "@nestjs/testing";
import { InactionJustificationTypeResolver } from "./inaction_justification_type.resolver";
import { InactionJustificationTypeService } from "./inaction_justification_type.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("InactionJustificationTypeResolver", () => {
  let resolver: InactionJustificationTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [InactionJustificationTypeResolver, InactionJustificationTypeService],
    }).compile();

    resolver = module.get<InactionJustificationTypeResolver>(InactionJustificationTypeService);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
