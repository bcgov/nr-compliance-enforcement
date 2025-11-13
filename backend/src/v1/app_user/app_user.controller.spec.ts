import { Test, TestingModule } from "@nestjs/testing";
import { AppUserController } from "./app_user.controller";
import { AppUserService } from "./app_user.service";
import { CssService } from "../../external_api/css/css.service";
import { REQUEST } from "@nestjs/core";

describe("AppUserController", () => {
  let controller: AppUserController;
  let appUserService: AppUserService;

  const mockAppUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByOffice: jest.fn(),
    findByAuthUserGuid: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    requestComsAccess: jest.fn(),
    remove: jest.fn(),
  };

  const mockCssService = {
    getUserRoleMapping: jest.fn(),
    getUserIdirByEmail: jest.fn(),
    updateUserRole: jest.fn(),
    deleteUserRole: jest.fn(),
  };

  const mockRequest = {
    headers: {
      authorization: "Bearer test-token",
    },
    user: {
      idir_username: "TESTUSER",
      auth_user_guid: "test-guid",
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppUserController],
      providers: [
        {
          provide: AppUserService,
          useValue: mockAppUserService,
        },
        {
          provide: CssService,
          useValue: mockCssService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    controller = module.get<AppUserController>(AppUserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of app users", async () => {
      const result = [{ app_user_guid: "test-guid", first_name: "Test", last_name: "User" }];
      mockAppUserService.findAll.mockResolvedValue(result);

      expect(await controller.findAll("test-token")).toBe(result);
      expect(mockAppUserService.findAll).toHaveBeenCalledWith("test-token");
    });
  });

  describe("findOne", () => {
    it("should return a single app user", async () => {
      const result = { app_user_guid: "test-guid", first_name: "Test", last_name: "User" };
      mockAppUserService.findOne.mockResolvedValue(result);

      expect(await controller.findOne("test-guid", "test-token")).toBe(result);
      expect(mockAppUserService.findOne).toHaveBeenCalledWith("test-guid", "test-token");
    });
  });
});
