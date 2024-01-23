import { Test, TestingModule } from "@nestjs/testing";
import { CaseManangementService } from "./case_management.service";
import { HttpService, HttpModule } from "@nestjs/axios";
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe("CaseManangmentService", () => {
  let service: CaseManangementService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestingModule],
      imports: [HttpModule],
    }).compile();

    service = module.get<CaseManangementService>(CaseManangementService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  /*
  it("should return coordinates for a given address", async () => {
    
    const mockCoordinates = [
      -123.3776552,
      48.4406837
    ];

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
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
    const features: Feature = await service.findAll(
      "Victoria","2975 Jutland Road"
    );

    expect(features.features[0].geometry.coordinates).toEqual(mockCoordinates);
  });
  */
});
