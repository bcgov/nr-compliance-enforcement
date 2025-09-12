import { Test, TestingModule } from "@nestjs/testing";
import { IpmAuthCategoryCodeResolver } from "./ipm_auth_category_code.resolver";
import { IpmAuthCategoryCodeService } from "./ipm_auth_category_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("IpmAuthCategoryCodeResolver", () => {
  let resolver: IpmAuthCategoryCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [IpmAuthCategoryCodeResolver, IpmAuthCategoryCodeService],
    }).compile();

    resolver = module.get<IpmAuthCategoryCodeResolver>(IpmAuthCategoryCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
