import { InspectionService } from "./inspection.service";
import { UnauthorizedAccessException } from "../../common/exceptions/unauthorized-access.exception";

describe("InspectionService.findOne", () => {
  const makeService = (findUniqueResult: unknown) => {
    const db: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      inspection: { findUnique: jest.fn().mockResolvedValue(findUniqueResult) },
    };
    const prisma: any = { $transaction: jest.fn((cb: (db: any) => Promise<unknown>) => cb(db)) };
    const mapper: any = { map: jest.fn((src: unknown) => ({ mapped: src })) };

    const service = new InspectionService(
      prisma,
      mapper,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    return { service, db, prisma, mapper };
  };

  it("throws UnauthorizedAccessException when the inspection is not visible or does not exist", async () => {
    const { service } = makeService(null);
    await expect(service.findOne("11111111-1111-1111-1111-111111111111")).rejects.toBeInstanceOf(
      UnauthorizedAccessException,
    );
  });

  it("does not reveal whether the record exists", async () => {
    const { service } = makeService(null);
    await expect(service.findOne("11111111-1111-1111-1111-111111111111")).rejects.toMatchObject({
      message: "You do not have access to this inspection.",
    });
  });

  it("returns the mapped inspection when found", async () => {
    const prismaRow = { inspection_guid: "g1", name: "INS-1" };
    const { service, mapper } = makeService(prismaRow);

    const result = await service.findOne("g1");

    expect(mapper.map).toHaveBeenCalledWith(prismaRow, "inspection", "Inspection");
    expect(result).toEqual({ mapped: prismaRow });
  });

  it("runs the read inside prisma.$transaction", async () => {
    const { service, prisma } = makeService({ inspection_guid: "g1" });
    await service.findOne("g1");
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });
});
