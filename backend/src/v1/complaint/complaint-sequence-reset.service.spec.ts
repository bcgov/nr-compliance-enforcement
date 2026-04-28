import { Test, TestingModule } from "@nestjs/testing";
import { SequenceResetScheduler } from "./sequence-reset.service";
import { ScheduleModule } from "@nestjs/schedule";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("SequenceResetScheduler", () => {
  let service: SequenceResetScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        SequenceResetScheduler,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = await module.resolve<SequenceResetScheduler>(SequenceResetScheduler);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
