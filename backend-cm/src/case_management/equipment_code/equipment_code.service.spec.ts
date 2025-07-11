import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentCodeService } from "./equipment_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("EquipmentCodeService", () => {
  let service: EquipmentCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [EquipmentCodeService],
    }).compile();

    service = module.get<EquipmentCodeService>(EquipmentCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
