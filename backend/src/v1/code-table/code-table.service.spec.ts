import { Test, TestingModule } from "@nestjs/testing";
import { CodeTableService } from "./code-table.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";

import {
  MockAgencyCodeTableRepository,
  MockAttractantCodeTableRepository,
} from "../../../test/mocks/mock-code-table-repositories";

import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";

describe("Testing: CodeTable Service", () => {
  let service: CodeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeTableService,
        {
          provide: getRepositoryToken(AgencyCode),
          useFactory: MockAgencyCodeTableRepository,
        },
        {
          provide: getRepositoryToken(AttractantCode),
          useFactory: MockAttractantCodeTableRepository,
        },
      ],
    }).compile();

    service = module.get<CodeTableService>(CodeTableService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return collection of agency codes", async () => {
    //-- arrange
    const _tableName = "agency";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(8);
  });

  it("should return collection of attractants", async () => {
    //-- arrange
    const _tableName = "attractant";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(8);
  });
});
