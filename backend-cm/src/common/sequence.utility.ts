import { InspectionPrismaService } from "../prisma/inspection/prisma.inspection.service";
import { InvestigationPrismaService } from "../prisma/investigation/prisma.investigation.service";
import { SharedPrismaService } from "../prisma/shared/prisma.shared.service";

const formatIdentifier = (prefix: string, sequenceNumber: number): string => {
  const yy = String(new Date().getFullYear()).slice(-2);
  const paddedNumber = String(sequenceNumber).padStart(6, "0");
  return `${prefix}${yy}-${paddedNumber}`;
};

const getNextSequenceValue = async (
  prisma: { $queryRawUnsafe: <T>(query: string) => Promise<T> },
  sequenceName: string,
): Promise<number> => {
  const result = await prisma.$queryRawUnsafe<{ nextval: bigint }[]>(`SELECT nextval('${sequenceName}') AS nextval`);
  return Number(result[0].nextval);
};

export const generateNextCaseIdentifier = async (prisma: SharedPrismaService): Promise<string> => {
  const sequenceNumber = await getNextSequenceValue(prisma, "shared.case_sequence");
  return formatIdentifier("C", sequenceNumber);
};

export const generateNextInvestigationIdentifier = async (prisma: InvestigationPrismaService): Promise<string> => {
  const sequenceNumber = await getNextSequenceValue(prisma, "investigation.investigation_sequence");
  return formatIdentifier("INV", sequenceNumber);
};

export const generateNextInspectionIdentifier = async (prisma: InspectionPrismaService): Promise<string> => {
  const sequenceNumber = await getNextSequenceValue(prisma, "inspection.inspection_sequence");
  return formatIdentifier("INS", sequenceNumber);
};
