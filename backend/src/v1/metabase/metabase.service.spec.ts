import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { MetabaseService } from "./metabase.service";
import { AppUserService } from "../app_user/app_user.service";

describe("MetabaseService", () => {
  let service: MetabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetabaseService,
        {
          provide: AppUserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<MetabaseService>(MetabaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
