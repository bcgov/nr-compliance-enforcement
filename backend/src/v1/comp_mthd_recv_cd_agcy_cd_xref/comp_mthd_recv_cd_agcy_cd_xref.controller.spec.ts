import { Test, TestingModule } from "@nestjs/testing";
import { CompMthdRecvCdAgcyCdXrefController } from "./comp_mthd_recv_cd_agcy_cd_xref.controller";
import { CompMthdRecvCdAgcyCdXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CompMthdRecvCdAgcyCdXref } from "./entities/comp_mthd_recv_cd_agcy_cd_xref";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("CompMthdRecvCdAgcyCdXrefController", () => {
  let controller: CompMthdRecvCdAgcyCdXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompMthdRecvCdAgcyCdXrefController],
      providers: [
        CompMthdRecvCdAgcyCdXrefService,
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

    controller = module.get<CompMthdRecvCdAgcyCdXrefController>(CompMthdRecvCdAgcyCdXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
