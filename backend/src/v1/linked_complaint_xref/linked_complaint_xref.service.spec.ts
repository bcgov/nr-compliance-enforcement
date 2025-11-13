import { Test, TestingModule } from "@nestjs/testing";
import { LinkedComplaintXrefService } from "./linked_complaint_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";
import { REQUEST } from "@nestjs/core";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import { resetSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";

describe("LinkedComplaintXrefService", () => {
  let service: LinkedComplaintXrefService;

  beforeEach(async () => {
    resetSharedDataMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkedComplaintXrefService,
        {
          provide: getRepositoryToken(LinkedComplaintXref),
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = await module.resolve<LinkedComplaintXrefService>(LinkedComplaintXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
