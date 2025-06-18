import { Test, TestingModule } from "@nestjs/testing";
import { SexCodeService } from "./sex_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("SexCodeService", () => {
  let service: SexCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [SexCodeService],
    }).compile();

    service = module.get<SexCodeService>(SexCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
