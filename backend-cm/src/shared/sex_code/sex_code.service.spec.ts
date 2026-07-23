import { Test, TestingModule } from "@nestjs/testing";
import { SexCodeService } from "./sex_code.service";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

describe("SexCodeService", () => {
  let service: SexCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleShared],
      providers: [SexCodeService],
    }).compile();

    service = await module.resolve<SexCodeService>(SexCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
