import { Test, TestingModule } from "@nestjs/testing";
import { IpmAuthCategoryCodeService } from "./ipm_auth_category_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("IpmAuthCategoryCodeService", () => {
  let service: IpmAuthCategoryCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [IpmAuthCategoryCodeService],
    }).compile();

    service = module.get<IpmAuthCategoryCodeService>(IpmAuthCategoryCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
