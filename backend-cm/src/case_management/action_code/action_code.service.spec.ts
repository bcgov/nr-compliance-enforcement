import { Test, TestingModule } from "@nestjs/testing";
import { ActionCodeService } from "./action_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ActionCodeService", () => {
  let service: ActionCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [ActionCodeService],
    }).compile();

    service = module.get<ActionCodeService>(ActionCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
