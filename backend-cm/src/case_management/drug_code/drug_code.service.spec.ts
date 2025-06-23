import { Test, TestingModule } from "@nestjs/testing";
import { DrugCodeService } from "./drug_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("DrugCodeService", () => {
  let service: DrugCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [DrugCodeService],
    }).compile();

    service = module.get<DrugCodeService>(DrugCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
