import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintReferralController } from "./complaint_referral.controller";
import { ComplaintReferralService } from "./complaint_referral.service";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("ComplaintReferralController", () => {
  let controller: ComplaintReferralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintReferralController],
      providers: [
        ComplaintReferralService,
        {
          provide: getRepositoryToken(ComplaintReferral),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<ComplaintReferralController>(ComplaintReferralController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
