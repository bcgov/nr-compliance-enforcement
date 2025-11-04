import { Test, TestingModule } from "@nestjs/testing";
import { LinkedComplaintXrefController } from "./linked_complaint_xref.controller";
import { LinkedComplaintXrefService } from "./linked_complaint_xref.service";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { REQUEST } from "@nestjs/core";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import { resetSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";

describe("LinkedComplaintXrefController", () => {
  let controller: LinkedComplaintXrefController;

  beforeEach(async () => {
    resetSharedDataMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkedComplaintXrefController],
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

    controller = module.get<LinkedComplaintXrefController>(LinkedComplaintXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
