import { GraphQLError } from "graphql";
import { NotFoundException } from "@nestjs/common";
import { InspectionResolver } from "./inspection.resolver";
import { InspectionService } from "./inspection.service";

describe("InspectionResolver.getInspection", () => {
  let resolver: InspectionResolver;
  let service: { findOne: jest.Mock };

  beforeEach(() => {
    service = { findOne: jest.fn() };
    resolver = new InspectionResolver(service as unknown as InspectionService);
    jest.spyOn((resolver as any).logger, "error").mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it("returns the inspection when the service resolves", async () => {
    service.findOne.mockResolvedValue({ inspectionGuid: "g1" });
    await expect(resolver.findOne("g1")).resolves.toEqual({ inspectionGuid: "g1" });
  });

  it("maps a NotFoundException to a GraphQL error with code NOT_FOUND", async () => {
    service.findOne.mockRejectedValue(new NotFoundException());

    await expect(resolver.findOne("cross-agency-guid")).rejects.toMatchObject({
      extensions: { code: "NOT_FOUND" },
    });
    await expect(resolver.findOne("cross-agency-guid")).rejects.toBeInstanceOf(GraphQLError);
  });

  it("maps any other error to a generic INTERNAL_SERVER_ERROR", async () => {
    service.findOne.mockRejectedValue(new Error("database exploded"));

    await expect(resolver.findOne("g1")).rejects.toMatchObject({
      message: "Error fetching data from inspection schema",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
