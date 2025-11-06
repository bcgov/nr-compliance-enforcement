import { Test, TestingModule } from "@nestjs/testing";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { CssService } from "../../external_api/css/css.service";
import { CacheModule } from "@nestjs/cache-manager";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import { resetSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";

describe("TeamController", () => {
  let controller: TeamController;

  beforeEach(async () => {
    resetSharedDataMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      imports: [CacheModule.register()],
      providers: [
        TeamService,
        {
          provide: CssService,
          useValue: {
            getUserRoles: jest.fn().mockResolvedValue([]),
            updateUserRole: jest.fn().mockResolvedValue([]),
            deleteUserRole: jest.fn().mockResolvedValue(true),
            getUserIdirByName: jest.fn().mockResolvedValue("MOCK"),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
