import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("EquipmentCodeService", () => {
  let service: EquipmentStatusCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [EquipmentStatusCodeService],
    }).compile();

    service = module.get<EquipmentStatusCodeService>(EquipmentStatusCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
