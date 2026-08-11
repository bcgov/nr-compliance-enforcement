import { toDate } from "../../common/custom_scalars";
import { ContraventionService } from "./contravention.service";
import { CreateUpdateContraventionInput } from "./dto/contravention";

const NODE_GUID = "11111111-1111-1111-1111-111111111111";
const INVESTIGATION_GUID = "22222222-2222-2222-2222-222222222222";
const SOURCE_GUID = "44444444-4444-4444-4444-444444444444";

const makeService = () => {
  const db: any = {
    contravention: { create: jest.fn().mockResolvedValue({ contravention_guid: "c1" }) },
    contravention_party_xref: { create: jest.fn() },
  };
  const prisma: any = {
    $transaction: jest.fn((cb: (db: any) => Promise<unknown>) => cb(db)),
  };
  const sharedPrisma: any = {
    legislation: { findUnique: jest.fn() },
    legislation_version: { findFirst: jest.fn().mockResolvedValue(null) },
  };
  const investigationService: any = {
    updateInvestigationTimestamp: jest.fn().mockResolvedValue(undefined),
    findOne: jest.fn().mockResolvedValue({ investigationGuid: INVESTIGATION_GUID }),
  };

  const service = new ContraventionService(
    prisma,
    sharedPrisma,
    { getIdirUsername: () => "test" } as any,
    investigationService,
  );

  return { service, db, sharedPrisma };
};

const legislationNode = (importStatus: string, effectiveDate: string) => ({
  legislation_guid: NODE_GUID,
  legislation_version: {
    import_status: importStatus,
    effective_date: toDate(effectiveDate),
    legislation_source_guid: SOURCE_GUID,
  },
});

const contraventionInput = (overrides: Partial<CreateUpdateContraventionInput> = {}): CreateUpdateContraventionInput =>
  ({
    investigationGuid: INVESTIGATION_GUID,
    investigationPartyGuids: [],
    legislationReference: NODE_GUID,
    date: toDate("2026-06-01"),
    community: "PRINCE GEORGE",
    ...overrides,
  }) as CreateUpdateContraventionInput;

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date("2026-07-27T20:00:00.000Z"));
});

afterEach(() => {
  jest.useRealTimers();
});

describe("ContraventionService.create", () => {
  it("rejects a contravention date in the future", async () => {
    const { service, sharedPrisma } = makeService();

    await expect(service.create(contraventionInput({ date: toDate("2026-07-28") }))).rejects.toThrow(
      "The contravention date cannot be in the future.",
    );
    expect(sharedPrisma.legislation.findUnique).not.toHaveBeenCalled();
  });

  it("rejects legislation that was not in force on the contravention date", async () => {
    const { service, sharedPrisma } = makeService();
    sharedPrisma.legislation.findUnique.mockResolvedValue(legislationNode("SUCCESS", "2026-06-02"));

    await expect(service.create(contraventionInput())).rejects.toThrow(
      "The selected legislation was not in force on 2026-06-01.",
    );
  });

  it("records the contravention when the version is in force", async () => {
    const { service, db, sharedPrisma } = makeService();
    sharedPrisma.legislation.findUnique.mockResolvedValue(legislationNode("SUCCESS", "2020-01-01"));

    await service.create(contraventionInput());

    expect(db.contravention.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ legislation_guid_ref: NODE_GUID }) }),
    );
  });
});
