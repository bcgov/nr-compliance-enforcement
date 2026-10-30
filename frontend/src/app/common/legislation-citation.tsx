import { FC } from "react";
import { Legislation } from "@/generated/graphql";
import { LegislationText } from "@/app/components/common/legislation-text";
import { buildLegislationCitationParts, indentByType } from "@/app/types/app/legislation";

interface LegislationCitationProps {
  legislation?: Legislation | null;
}

/**
 * Full contravention display for the contraventions tab and decision modals: the bolded citation and
 * section title, then each subsection on its own indented line with a bolded number.
 */
export const LegislationCitation: FC<LegislationCitationProps> = ({ legislation }) => {
  if (!legislation) return <span>Loading...</span>;

  const { actName, isRegulation, sectionFullCitation, sectionTitle, subsections } =
    buildLegislationCitationParts(legislation);

  // A regulation's full citation omits its parent act
  const heading = isRegulation ? `${actName}, ${sectionFullCitation}` : sectionFullCitation;

  return (
    <div className="legislation-citation">
      <div>
        <strong>{heading}</strong> <LegislationText>{sectionTitle}</LegislationText>
      </div>
      {subsections.length > 0 && (
        <div className="legislation-indent-1">
          {subsections.map((line) => (
            <div
              // Each level appears once in a single chain, so type and citation are unique per line
              key={`${line.type}-${line.citation}`}
              className={indentByType[line.type as keyof typeof indentByType]}
            >
              {line.citation && (
                <>
                  <strong>({line.citation})</strong>{" "}
                </>
              )}
              <LegislationText>{line.text}</LegislationText>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
