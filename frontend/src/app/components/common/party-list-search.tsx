import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

import { FC, useEffect, useState } from "react";
import Option from "@apptypes/app/option";
import { HintInputWrapper } from "@components/common/custom-hint";
import { usePartySearchQuery } from "@/app/graphql/hooks/usePartySearchQuery";
import { usePartySearch } from "@/app/components/containers/parties/hooks/use-party-search";

type Props = {
  id?: string;
  onChange?: (selected: Option | null) => void;
  errorMessage?: string;
};

export const PartyListSearch: FC<Props> = ({ id = "partyListSearch", onChange = () => {}, errorMessage = "" }) => {
  //States
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [hintText, setHintText] = useState<string>("");
  const [partyData, setPartyData] = useState<any>([]);
  const { searchValues, setValues } = usePartySearch();
  const { data, isLoading: isSearchPartyLoading } = usePartySearchQuery();

  //Effects
  useEffect(() => {
    if (data) {
      const parties = data.searchParties.items.map((item) => ({
        id: item.partyIdentifier,
        first_name: item.person?.firstName || "",
        last_name: item.person?.lastName || "",
      }));
      setPartyData(parties);
    } else setPartyData([]);
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
        labelKey={(option: any) => `${option.first_name} ${option.last_name}`}
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
            <Highlighter search={props.text}>{`Party Name: ${option.first_name} ${option.last_name}`}</Highlighter>{" "}
          </div>
        )}
      />
      <div className="error-message">{errorMessage}</div>
    </div>
  );
};
