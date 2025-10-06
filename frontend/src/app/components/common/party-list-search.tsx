import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useEffect, useState } from "react";
import { HintInputWrapper } from "@components/common/custom-hint";
import { usePartySearchQuery } from "@/app/graphql/hooks/usePartySearchQuery";
import { usePartySearch } from "@/app/components/containers/parties/hooks/use-party-search";
import { Party } from "@/generated/graphql";
import { Badge } from "react-bootstrap";

type Props = {
  id?: string;
  onChange?: (selected: Party) => void;
  errorMessage?: string;
};

export const PartyListSearch: FC<Props> = ({ id = "partyListSearch", onChange = () => {}, errorMessage = "" }) => {
  //States
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [hintText, setHintText] = useState<string>("");
  const [partyData, setPartyData] = useState<Party[]>([]);
  const { searchValues, setValues } = usePartySearch();
  const { data, isLoading: isSearchPartyLoading } = usePartySearchQuery();

  //Effects
  useEffect(() => {
    if (data) {
      setPartyData(data.searchParties.items);
    } else {
      setPartyData([]);
    }
  }, [data, searchValues]);

  const handlePartySelect = (selected: any[]) => {
    const party = selected[0] ?? null;
    setSelectedParty(party);
    onChange(party);
  };

  const handleInputChange = (text: string) => {
    if (text.length > 0) {
      setHintText("");
    }
  };

  const handleSearch = async (query: string) => {
    setValues({ search: query });
  };

  return (
    <div className="complaint-search-container">
      <AsyncTypeahead
        clearButton
        id={id}
        labelKey={(option: any) =>
          `${option.business ? option.business?.name : option.person?.firstName + " " + option.person?.lastName}`
        }
        minLength={2}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onChange={handlePartySelect}
        selected={selectedParty ? [selectedParty] : []}
        filterBy={() => true}
        isLoading={isSearchPartyLoading}
        options={partyData}
        placeholder="Search for a party"
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
          <div>
            <Highlighter
              search={props.text}
            >{`${option.business ? option.business.name : option.person?.firstName + " " + option.person?.lastName}`}</Highlighter>{" "}
            <Badge bg="species-badge comp-species-badge">{`${option.business ? "Business" : "Person"}`}</Badge>
          </div>
        )}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
