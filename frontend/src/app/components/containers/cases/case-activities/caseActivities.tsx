import { CaseActivityCard } from "@/app/components/containers/cases/case-activities/caseActivityCard";
import { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

interface CaseReference {
  caseIdentifier: string;
  name?: string;
}

interface CaseActivitiesProps {
  cases: CaseReference[];
}

export const CaseActivities: FC<CaseActivitiesProps> = ({ cases }) => {
  const [viewMore, setViewMore] = useState(false);

  const visibleCases = viewMore ? cases : cases.slice(0, 5);

  return (
    <>
      {visibleCases.map((caseRef) => (
        <CaseActivityCard
          key={caseRef.caseIdentifier}
          caseIdentifier={caseRef.caseIdentifier}
          caseName={caseRef.name ?? undefined}
        />
      ))}
      {cases.length > 5 && (
        <button
          className="viewMore"
          onClick={() => setViewMore(!viewMore)}
        >
          {viewMore ? (
            <>
              View less <BsChevronUp />
            </>
          ) : (
            <>
              View more <BsChevronDown />
            </>
          )}
        </button>
      )}
    </>
  );
};
