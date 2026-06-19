import {
  generateNextCaseIdentifier,
  generateInvestigationIdentifier,
  generateInspectionIdentifier,
} from "./sequence.utility";
import { SharedPrismaService } from "../prisma/shared/prisma.shared.service";

describe("generateNextCaseIdentifier", () => {
  it("draws the next value from the case sequence and formats it with the CASE prefix", async () => {
    const prisma = {
      $queryRawUnsafe: jest.fn().mockResolvedValue([{ nextval: BigInt(123) }]),
    } as unknown as SharedPrismaService;

    const identifier = await generateNextCaseIdentifier(prisma);

    // Year is derived from the current date, so assert the shape only
    expect(identifier).toMatch(/^CASE\d{2}-000123$/);
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledWith(expect.stringContaining("shared.case_sequence"));
  });
});

describe("generateInvestigationIdentifier", () => {
  it("reuses the case number for the first investigation in a case", () => {
    expect(generateInvestigationIdentifier("CASE26-000001", 0)).toBe("INV26-000001");
  });

  it("appends a zero-padded suffix for additional investigations", () => {
    expect(generateInvestigationIdentifier("CASE26-000001", 1)).toBe("INV26-000001-02");
    expect(generateInvestigationIdentifier("CASE26-000001", 2)).toBe("INV26-000001-03");
    expect(generateInvestigationIdentifier("CASE26-000001", 9)).toBe("INV26-000001-10");
  });
});

describe("generateInspectionIdentifier", () => {
  it("reuses the case number for the first inspection in a case", () => {
    expect(generateInspectionIdentifier("CASE26-000001", 0)).toBe("INSP26-000001");
  });

  it("appends a zero-padded suffix for additional inspections", () => {
    expect(generateInspectionIdentifier("CASE26-000001", 1)).toBe("INSP26-000001-02");
    expect(generateInspectionIdentifier("CASE26-000001", 2)).toBe("INSP26-000001-03");
  });

  it("numbers inspections independently of investigations within the same case", () => {
    // Two investigations already exist, but the first inspection still gets the bare case number.
    expect(generateInspectionIdentifier("CASE26-000001", 0)).toBe("INSP26-000001");
  });
});
