import { Test, TestingModule } from "@nestjs/testing";
import { AgeCodeService } from "./age_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("AgeCodeService", () => {
  let service: AgeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [AgeCodeService],
    }).compile();

    service = module.get<AgeCodeService>(AgeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
