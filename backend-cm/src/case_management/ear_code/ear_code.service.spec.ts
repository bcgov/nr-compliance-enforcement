import { Test, TestingModule } from "@nestjs/testing";
import { EarCodeService } from "./ear_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("EarCodeService", () => {
  let service: EarCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [EarCodeService],
    }).compile();

    service = module.get<EarCodeService>(EarCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
