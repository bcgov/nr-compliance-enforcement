import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentStatusCodeResolver } from "./equipment_status_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";

describe("EquipmentStatusCodeResolver", () => {
  let resolver: EquipmentStatusCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [EquipmentStatusCodeResolver, EquipmentStatusCodeService],
    }).compile();

    resolver = module.get<EquipmentStatusCodeResolver>(EquipmentStatusCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
