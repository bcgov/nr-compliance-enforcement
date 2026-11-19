import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { getWithApiKey } from "../../external_api/shared_data";

jest.mock("../../external_api/shared_data", () => ({
  getWithApiKey: jest.fn(),
}));

describe("Testing: Public Controller", () => {
  let app: INestApplication;
  const env = process.env;

  beforeEach(async () => {
    process.env = { ...env, PUBLIC_API_KEY: "test-key" };
    (getWithApiKey as jest.Mock).mockResolvedValue({ data: { cosGeoOrgUnits: [], parks: [] } });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [PublicService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    process.env = env;
  });

  it.each(["community", "park"])(
    "should return 200 when GET %s is called with the api key",
    async (resource) => {
      const response = await request(app.getHttpServer()).get(`/public/${resource}`).set("x-api-key", "test-key");
      expect(response.statusCode).toBe(200);
    },
  );

  it.each(["community", "park"])(
    "should return 401 when GET %s is called without the api key",
    async (resource) => {
      const response = await request(app.getHttpServer()).get(`/public/${resource}`);
      expect(response.statusCode).toBe(401);
    },
  );

  it("should return 401 when the api key is invalid", async () => {
    const response = await request(app.getHttpServer()).get("/public/park").set("x-api-key", "wrong-key");
    expect(response.statusCode).toBe(401);
  });

  it("should return 401 when called with the complaints api key", async () => {
    process.env.COMPLAINTS_API_KEY = "complaints-key";
    const response = await request(app.getHttpServer()).get("/public/park").set("x-api-key", "complaints-key");
    expect(response.statusCode).toBe(401);
  });

  it("should return 401 when PUBLIC_API_KEY is not set", async () => {
    delete process.env.PUBLIC_API_KEY;
    let response = await request(app.getHttpServer()).get("/public/park");
    expect(response.statusCode).toBe(401);

    response = await request(app.getHttpServer()).get("/public/park").set("x-api-key", "undefined");
    expect(response.statusCode).toBe(401);
  });

  it("should not call the shared data api when the api key is invalid", async () => {
    (getWithApiKey as jest.Mock).mockClear();
    await request(app.getHttpServer()).get("/public/park").set("x-api-key", "wrong-key");
    expect(getWithApiKey).not.toHaveBeenCalled();
  });

  it("should return 500 when the shared data api returns errors", async () => {
    (getWithApiKey as jest.Mock).mockResolvedValue({ data: { parks: null }, errors: [{ message: "Unauthorized" }] });
    const response = await request(app.getHttpServer()).get("/public/park").set("x-api-key", "test-key");
    expect(response.statusCode).toBe(500);
  });

  it("should return distinct communities sorted by name", async () => {
    (getWithApiKey as jest.Mock).mockResolvedValue({
      data: {
        cosGeoOrgUnits: [
          { areaCode: "VIC", areaName: "Victoria", zoneCode: "SI", regionCode: "WST" },
          { areaCode: "ALB", areaName: "Alberni", zoneCode: "CI", regionCode: "WST" },
          { areaCode: "VIC", areaName: "Victoria", zoneCode: "SI", regionCode: "WST" },
          { areaCode: null, areaName: null, zoneCode: "SI", regionCode: "WST" },
        ],
      },
    });
    const response = await request(app.getHttpServer()).get("/public/community").set("x-api-key", "test-key");
    expect(response.body).toEqual([
      { code: "ALB", name: "Alberni", zone: "CI", region: "WST" },
      { code: "VIC", name: "Victoria", zone: "SI", region: "WST" },
    ]);
  });
});
