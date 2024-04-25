import { Test, TestingModule } from "@nestjs/testing";
import { BcGeoCoderService } from "./bc_geo_coder.service";
import { HttpService, HttpModule } from "@nestjs/axios";
import { Feature } from "../../types/bc_geocoder/bcGeocoderType";
import { AxiosResponse } from "axios";
import { of } from "rxjs";

describe("BcGeoCoderService", () => {
  let service: BcGeoCoderService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcGeoCoderService],
      imports: [HttpModule],
    }).compile();

    service = module.get<BcGeoCoderService>(BcGeoCoderService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return coordinates for a given address", async () => {
    const mockCoordinates = [-123.3776552, 48.4406837];

    const mockResponse: AxiosResponse = {
      data: {
        features: [
          {
            geometry: {
              coordinates: mockCoordinates,
            },
          },
        ],
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: undefined,
      },
    };

    jest.spyOn(httpService, "get").mockReturnValue(of(mockResponse));
    const features: Feature = await service.findAll("Victoria", "2975 Jutland Road");

    expect(features.features[0].geometry.coordinates).toEqual(mockCoordinates);
  });
});
