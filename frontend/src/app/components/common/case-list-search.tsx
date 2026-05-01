import { Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useEffect, useMemo, useState } from "react";
import { Badge } from "react-bootstrap";
import Option from "@apptypes/app/option";
import { useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { applyStatusClass } from "@common/methods";
import { useCaseSearchQuery } from "@/app/graphql/hooks/useCaseSearchQuery";
import { CompAsyncTypeahead } from "@/app/components/common/comp-type-ahead";
import { useInvestigationSearchQuery } from "@/app/graphql/hooks/useInvestigationSearchQuery";

type Props = {
  id?: string;
  onChange?: (selected: Option | null) => void;
  errorMessage?: string;
};

type CaseSearchOption = {
  id: string;
  name: string;
  agency: string;
  status: string;
  investigations: Array<{ name: string; openedTimestamp: Date }>;
};

export const CaseListSearch: FC<Props> = ({ id = "caseListSearch", onChange = () => {}, errorMessage = "" }) => {
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));

  //States
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [caseFileData, setCaseFileData] = useState<any[]>([]);

  // Step 1: search investigations
  const { data: investigationData, isLoading: isInvestigationLoading } = useInvestigationSearchQuery({
    filters: { search: searchString },
    queryKey: [searchString],
    enabled: searchString.length > 0,
  });

  // Build a map of investigationGuid -> { name, openedTimestamp } for lookup during merge
  const investigationsByGuid = useMemo(() => {
    const map = new Map<string, { name: string; openedTimestamp: Date }>();
    for (const investigation of investigationData?.searchInvestigations?.items ?? []) {
      if (investigation?.investigationGuid) {
        map.set(investigation.investigationGuid, {
          name: investigation.name ?? investigation.investigationGuid,
          openedTimestamp: investigation.openedTimestamp,
        });
      }
    }
    return map;
  }, [investigationData]);

  // Collect activity GUIDs to feed into the case search
  const activityGuids = useMemo(() => Array.from(investigationsByGuid.keys()), [investigationsByGuid]);

  // Step 2: search cases (waits for investigation search to settle)
  const { data: caseData, isLoading: isCaseLoading } = useCaseSearchQuery({
    filters: { search: searchString, activityGuids },
    queryKey: [searchString, activityGuids.join(",")],
    enabled: searchString.length > 0 && !isInvestigationLoading,
  });

  // Effects: merge results into the typeahead shape
  useEffect(() => {
    if (!caseData) {
      setCaseFileData([]);
      return;
    }

    const merged: CaseSearchOption[] = caseData.searchCaseFiles.items
      .filter((item): item is typeof item & { caseIdentifier: string } => Boolean(item.caseIdentifier))
      .map((item) => {
        const investigations = (item.activities ?? [])
          .map((activity) => {
            const ref = activity?.activityIdentifier;
            return ref ? investigationsByGuid.get(ref) : undefined;
          })
          .filter((investigation): investigation is { name: string; openedTimestamp: Date } => Boolean(investigation));

        return {
          id: item.caseIdentifier,
          name: item.name || item.caseIdentifier,
          agency: item.leadAgency?.longDescription || "Unknown",
          status: item.caseStatus?.caseStatusCode || "Unknown",
          investigations,
        };
      });

    setCaseFileData(merged);
  }, [caseData, investigationsByGuid]);

  const getStatusDescription = (input: string): string => {
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code.longDescription;
  };

  const handleCaseSelect = async (selected: any[]) => {
    if (selected.length === 0) {
      setSelectedCase(null);
      onChange(null); //update parent component
      setHintText("");
      return;
    }

    const selectedCase = selected[0];
    setSelectedCase(selectedCase);
    onChange(
      selected.length > 0 ? ({ label: selected[0].name as string, value: selected[0].id as string } as Option) : null,
    );
    setHintText(isFocused ? `${selectedCase.name}, ${getStatusDescription(selectedCase.status) || ""}` : "");
  };

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      setHintText("");
    }
  };

  const handleSearch = (query: string) => {
    setSearchString(query);
  };

  return (
    <div className="complaint-search-container">
      <CompAsyncTypeahead
        id={id}
        labelKey="name"
        minLength={2}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onChange={handleCaseSelect}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selected={selectedCase ? [selectedCase] : []}
        isLoading={isInvestigationLoading || isCaseLoading}
        options={caseFileData}
        placeholder="Search for a case"
        isInvalid={errorMessage.length > 0}
        hintText={hintText}
        renderMenuItemChildren={(option, props) => {
          const caseOption = option as CaseSearchOption;
          return (
            <>
              <div>
                <Highlighter search={props.text}>{`${caseOption.name}`}</Highlighter>{" "}
                <div className={`badge ${applyStatusClass(caseOption.status)}`}>
                  {getStatusDescription(caseOption.status)}
                </div>
              </div>
              <dt>
                <Badge bg="species-badge comp-species-badge">{caseOption.agency}</Badge>
              </dt>
            </>
          );
        }}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
