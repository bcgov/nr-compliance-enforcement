import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentStatusCodeResolver } from "./equipment_status_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";

describe("EquipmentStatusCodeResolver", () => {
  let resolver: EquipmentStatusCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [EquipmentStatusCodeResolver, EquipmentStatusCodeService],
    }).compile();

    resolver = module.get<EquipmentStatusCodeResolver>(EquipmentStatusCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
