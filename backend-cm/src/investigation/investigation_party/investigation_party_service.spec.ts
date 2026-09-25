import { BadRequestException } from "@nestjs/common";
import { InvestigationPartyService } from "./investigation_party_service";

const INVESTIGATION_GUID = "11111111-1111-1111-1111-111111111111";
const PARTY_GUID = "22222222-2222-2222-2222-222222222222";
const SHARED_PARTY_GUID = "33333333-3333-3333-3333-333333333333";

const makeService = () => {
  const db: any = {
    investigation_party: {
      findFirst: jest.fn().mockResolvedValue({
        investigation_party_guid: PARTY_GUID,
        investigation_guid: INVESTIGATION_GUID,
        party_guid_ref: SHARED_PARTY_GUID,
      }),
      update: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
  };
  // withRlsTransaction skips setting claims when there is no request in scope, so the
  // callback can just be handed the mock db
  const prisma: any = {
    $transaction: jest.fn((cb: (db: any) => Promise<unknown>) => cb(db)),
    contravention_party_xref: { count: jest.fn().mockResolvedValue(0) },
  };
  const investigationService: any = {
    updateInvestigationTimestamp: jest.fn().mockResolvedValue(undefined),
    findOne: jest.fn().mockResolvedValue({ investigationGuid: INVESTIGATION_GUID }),
  };
  const partyService: any = { deactivate: jest.fn().mockResolvedValue(undefined) };

  const service = new InvestigationPartyService(
    prisma,
    {} as any,
    {} as any,
    { getIdirUsername: () => "test" } as any,
    investigationService,
    partyService,
  );

  return { service, db, prisma, partyService };
};

describe("InvestigationPartyService.remove", () => {
  it("blocks removal while the party is on an active contravention", async () => {
    const { service, prisma, db } = makeService();
    prisma.contravention_party_xref.count.mockResolvedValue(1);

    await expect(service.remove(INVESTIGATION_GUID, PARTY_GUID)).rejects.toThrow(BadRequestException);
    expect(db.investigation_party.update).not.toHaveBeenCalled();
  });

  it("counts only contraventions that are themselves still active", async () => {
    // Removing the last party from a contravention deactivates the contravention but leaves its
    // xref active, so the guard has to look through to the parent. Without the parent clause a
    // party could never be removed after its contravention was.
    const { service, prisma } = makeService();

    await service.remove(INVESTIGATION_GUID, PARTY_GUID);

    expect(prisma.contravention_party_xref.count).toHaveBeenCalledWith({
      where: {
        investigation_party_guid: PARTY_GUID,
        active_ind: true,
        contravention: { active_ind: true },
      },
    });
  });

  it("deactivates the investigation party and its global profile when this was its last investigation", async () => {
    const { service, db, partyService } = makeService();
    db.investigation_party.count.mockResolvedValue(0);

    await service.remove(INVESTIGATION_GUID, PARTY_GUID);

    expect(db.investigation_party.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ active_ind: false }) }),
    );
    expect(partyService.deactivate).toHaveBeenCalledWith(SHARED_PARTY_GUID);
  });

  it("keeps the global profile when another investigation still links to it", async () => {
    const { service, db, partyService } = makeService();
    db.investigation_party.count.mockResolvedValue(1);

    await service.remove(INVESTIGATION_GUID, PARTY_GUID);

    expect(db.investigation_party.update).toHaveBeenCalled();
    expect(partyService.deactivate).not.toHaveBeenCalled();
  });

  it("leaves the shared schema alone for a party that was never published", async () => {
    const { service, db, partyService } = makeService();
    db.investigation_party.findFirst.mockResolvedValue({
      investigation_party_guid: PARTY_GUID,
      investigation_guid: INVESTIGATION_GUID,
      party_guid_ref: null,
    });

    await service.remove(INVESTIGATION_GUID, PARTY_GUID);

    expect(db.investigation_party.count).not.toHaveBeenCalled();
    expect(partyService.deactivate).not.toHaveBeenCalled();
  });
});
