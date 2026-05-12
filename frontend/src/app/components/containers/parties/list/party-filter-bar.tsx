import { FC } from "react";
import SearchInput from "@components/common/search-input";
import { usePartySearch } from "../hooks/use-party-search";

export const PartyFilterBar: FC = () => {
  const { searchValues, setValues } = usePartySearch();

  const handleSearchChange = (query: string) => {
    setValues({ search: query });
  };

  // Search is handled through the form hook
  const handleSearch = () => {};

  return (
    <div className="comp-filter-bar">
      <div className="search-bar">
        <SearchInput
          viewType={searchValues.viewType}
          searchQuery={searchValues.search}
          applySearchQuery={handleSearchChange}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
};
