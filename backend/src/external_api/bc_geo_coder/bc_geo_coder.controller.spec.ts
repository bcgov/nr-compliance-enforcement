import { Test, TestingModule } from "@nestjs/testing";
import { BcGeoCoderController } from "./bc_geo_coder.controller";
import { BcGeoCoderService } from "./bc_geo_coder.service";
import { HttpModule, HttpService } from "@nestjs/axios";

describe("BcGeoCoderController", () => {
  let controller: BcGeoCoderController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BcGeoCoderController],
      providers: [BcGeoCoderService],
      imports: [HttpModule],
    }).compile();

    controller = module.get<BcGeoCoderController>(BcGeoCoderController);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
