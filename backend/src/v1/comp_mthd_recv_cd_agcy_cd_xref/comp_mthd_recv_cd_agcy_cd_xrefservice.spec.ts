import { Test, TestingModule } from "@nestjs/testing";
import { CompMthdRecvCdAgcyCdXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CompMthdRecvCdAgcyCdXref } from "./entities/comp_mthd_recv_cd_agcy_cd_xref";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("CompMthdRecvCdAgcyCdXrefService", () => {
  let service: CompMthdRecvCdAgcyCdXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CompMthdRecvCdAgcyCdXrefService>(CompMthdRecvCdAgcyCdXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
