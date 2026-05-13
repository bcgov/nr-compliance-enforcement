import { GraphQLError } from "graphql";
import { InspectionResolver } from "./inspection.resolver";
import { InspectionService } from "./inspection.service";
import { UnauthorizedAccessException } from "../../common/exceptions/unauthorized-access.exception";

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

  it("maps an UnauthorizedAccessException to a GraphQL error with code UNAUTHORIZED", async () => {
    service.findOne.mockRejectedValue(new UnauthorizedAccessException("You do not have access to this inspection."));

    await expect(resolver.findOne("cross-agency-guid")).rejects.toMatchObject({
      message: "You do not have access to this inspection.",
      extensions: { code: "UNAUTHORIZED" },
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
