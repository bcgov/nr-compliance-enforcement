import { SharedPrismaService } from "../prisma/shared/prisma.shared.service";

// Note that there is a small discrepency here for the parts of the province not in the
// Pacific Timezone in that items created between midnight and 1am on January 1st will
// still be given the previous years prefix and sequence numbering
const getCurrentYear = (): number => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "2-digit",
  });
  return Number(formatter.format(new Date()));
};

const CASE_PREFIX = "CASE";
const INVESTIGATION_PREFIX = "INV";
const INSPECTION_PREFIX = "INSP";

const formatIdentifier = (prefix: string, sequenceNumber: number): string => {
  const yy = getCurrentYear();
  const paddedNumber = String(sequenceNumber).padStart(6, "0");
  return `${prefix}${yy}-${paddedNumber}`;
};

const getNextSequenceValue = async (prisma: SharedPrismaService, sequenceName: string): Promise<number> => {
  const result = await prisma.$queryRawUnsafe<{ nextval: bigint }[]>(`SELECT nextval('${sequenceName}') AS nextval`);
  return Number(result[0].nextval);
};

export const generateNextCaseIdentifier = async (prisma: SharedPrismaService): Promise<string> => {
  const sequenceNumber = await getNextSequenceValue(prisma, "shared.case_sequence");
  return formatIdentifier(CASE_PREFIX, sequenceNumber);
};

const getCaseNumberPortion = (caseName: string): string =>
  caseName.startsWith(CASE_PREFIX) ? caseName.slice(CASE_PREFIX.length) : caseName;

const buildCaseAlignedIdentifier = (prefix: string, caseName: string, existingCount: number): string => {
  const base = `${prefix}${getCaseNumberPortion(caseName)}`;
  return existingCount > 0 ? `${base}-${String(existingCount + 1).padStart(2, "0")}` : base;
};

export const generateInvestigationIdentifier = (caseName: string, existingInvestigationCount: number): string =>
  buildCaseAlignedIdentifier(INVESTIGATION_PREFIX, caseName, existingInvestigationCount);

export const generateInspectionIdentifier = (caseName: string, existingInspectionCount: number): string =>
  buildCaseAlignedIdentifier(INSPECTION_PREFIX, caseName, existingInspectionCount);
