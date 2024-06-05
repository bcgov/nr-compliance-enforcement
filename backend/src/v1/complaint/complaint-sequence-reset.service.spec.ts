import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintSequenceResetScheduler } from "./complaint-sequence-reset.service";
import { ScheduleModule } from "@nestjs/schedule";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("ComplaintSequenceResetScheduler", () => {
  let service: ComplaintSequenceResetScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        ComplaintSequenceResetScheduler,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<ComplaintSequenceResetScheduler>(ComplaintSequenceResetScheduler);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
