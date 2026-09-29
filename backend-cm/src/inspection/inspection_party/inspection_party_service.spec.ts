import { InspectionPartyService } from "./inspection_party_service";

const INSPECTION_GUID = "11111111-1111-1111-1111-111111111111";
const PARTY_GUID = "22222222-2222-2222-2222-222222222222";
const SHARED_PARTY_GUID = "33333333-3333-3333-3333-333333333333";

const makeService = (partyGuidRef: string | null = SHARED_PARTY_GUID) => {
  const tx: any = {
    inspection_party: {
      findFirst: jest.fn().mockResolvedValue({
        inspection_party_guid: PARTY_GUID,
        inspection_guid: INSPECTION_GUID,
        party_guid_ref: partyGuidRef,
      }),
      update: jest.fn().mockResolvedValue({}),
    },
  };
  const prisma: any = { $transaction: jest.fn((cb: (tx: any) => Promise<unknown>) => cb(tx)) };
  const inspectionService: any = { findOne: jest.fn().mockResolvedValue({ inspectionGuid: INSPECTION_GUID }) };
  const partyService: any = { deactivateIfUnlinked: jest.fn().mockResolvedValue(undefined) };

  const service = new InspectionPartyService(
    prisma,
    {} as any,
    { getIdirUsername: () => "test" } as any,
    inspectionService,
    partyService,
  );

  return { service, tx, partyService };
};

describe("InspectionPartyService.remove", () => {
  it("deactivates the inspection party and hands the shared profile to the party service", async () => {
    const { service, tx, partyService } = makeService();

    await service.remove(INSPECTION_GUID, PARTY_GUID);

    expect(tx.inspection_party.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ active_ind: false }) }),
    );
    expect(partyService.deactivateIfUnlinked).toHaveBeenCalledWith(SHARED_PARTY_GUID);
  });

  it("leaves the shared schema alone for a party that was never published", async () => {
    const { service, tx, partyService } = makeService(null);

    await service.remove(INSPECTION_GUID, PARTY_GUID);

    expect(tx.inspection_party.update).toHaveBeenCalled();
    expect(partyService.deactivateIfUnlinked).not.toHaveBeenCalled();
  });
});
