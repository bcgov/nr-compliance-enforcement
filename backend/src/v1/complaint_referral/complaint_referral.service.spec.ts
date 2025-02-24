import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintReferralService } from "./complaint_referral.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { ComplaintReferral } from "./entities/complaint_referral.entity";

describe("ComplaintReferralService", () => {
  let service: ComplaintReferralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ComplaintReferralService>(ComplaintReferralService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
