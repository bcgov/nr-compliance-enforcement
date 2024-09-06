import { Test, TestingModule } from "@nestjs/testing";
import { AttractantHwcrXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AttractantHwcrXref } from "./entities/attractant_hwcr_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("AttractantHwcrXrefService", () => {
  let service: AttractantHwcrXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttractantHwcrXrefService,
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<AttractantHwcrXrefService>(AttractantHwcrXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
