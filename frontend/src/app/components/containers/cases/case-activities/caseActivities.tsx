import { CaseActivityCard } from "@/app/components/containers/cases/case-activities/caseActivityCard";
import { FC } from "react";

interface CaseReference {
  caseIdentifier: string;
  name?: string;
}

interface CaseActivitiesProps {
  cases: CaseReference[];
}

export const CaseActivities: FC<CaseActivitiesProps> = ({ cases }) => {
  return (
    <>
      {cases.map((caseRef) => (
        <CaseActivityCard
          key={caseRef.caseIdentifier}
          caseIdentifier={caseRef.caseIdentifier}
          caseName={caseRef.name ?? undefined}
        />
      ))}
    </>
  );
};
