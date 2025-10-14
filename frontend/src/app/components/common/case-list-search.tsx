import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import Option from "@apptypes/app/option";
import { useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { applyStatusClass } from "@common/methods";
import { HintInputWrapper } from "@components/common/custom-hint";
import { useCaseSearchQuery } from "@/app/graphql/hooks/useCaseSearchQuery";

type Props = {
  id?: string;
  onChange?: (selected: Option | null) => void;
  errorMessage?: string;
};

export const CaseListSearch: FC<Props> = ({ id = "caseListSearch", onChange = () => {}, errorMessage = "" }) => {
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));

  //States
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [caseFileData, setCaseFileData] = useState<any[]>([]);

  const { data, isLoading: isSearchCaseLoading } = useCaseSearchQuery("");

  //Effects
  useEffect(() => {
    if (data) {
      const caseFiles = data.searchCaseFiles.items.map((item) => ({
        id: item.caseIdentifier,
        name: item.name || item.caseIdentifier,
        agency: item.leadAgency?.longDescription || "Unknown",
        status: item.caseStatus?.caseStatusCode || "Unknown",
      }));
      setCaseFileData(caseFiles);
    } else setCaseFileData([]);
  }, [data, searchString]);

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

  const handleSearch = async (query: string) => {
    setSearchString(query);
  };

  return (
    <div className="complaint-search-container">
      <AsyncTypeahead
        clearButton
        id={id}
        labelKey="name"
        minLength={2}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onChange={handleCaseSelect}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selected={selectedCase ? [selectedCase] : []}
        filterBy={() => true}
        isLoading={isSearchCaseLoading}
        options={caseFileData}
        placeholder="Search for a case"
        isInvalid={errorMessage.length > 0}
        className="comp-select comp-details-input full-width comp-async comp-async-text"
        renderInput={({ inputRef, referenceElementRef, ...inputProps }: any) => (
          <HintInputWrapper
            hintText={hintText}
            inputProps={inputProps}
            inputRef={inputRef}
            referenceElementRef={referenceElementRef}
          />
        )}
        renderMenuItemChildren={(option: any, props: any) => (
          <>
            <div>
              <Highlighter search={props.text}>{`${option.name}`}</Highlighter>{" "}
              <div className={`badge ${applyStatusClass(option.status)}`}>{getStatusDescription(option.status)}</div>
            </div>
            <dt>
              <Badge bg="species-badge comp-species-badge">{option.agency}</Badge>
            </dt>
          </>
        )}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
