import { Test, TestingModule } from "@nestjs/testing";
import { AttractantHwcrXrefController } from "./comp_mthd_recv_cd_agcy_cd_xref.controller";
import { AttractantHwcrXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CompMthdRecvCdAgcyCdXref } from "./entities/comp_mthd_recv_cd_agcy_cd_xref";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("AttractantHwcrXrefController", () => {
  let controller: AttractantHwcrXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractantHwcrXrefController],
      providers: [
        AttractantHwcrXrefService,
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<AttractantHwcrXrefController>(AttractantHwcrXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
