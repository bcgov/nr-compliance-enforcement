import { ChangeEvent, FC, KeyboardEvent, useState, useEffect } from "react";
import { useAppSelector } from "@hooks/hooks";
import { selectActiveTab } from "@store/reducers/app";
import { CloseButton, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import COMPLAINT_TYPES from "@/app/types/app/complaint-types";
import { getUserAgency } from "@service/user-service";

type Props = {
  viewType: "map" | "list";
  searchQuery: string | undefined;
  applySearchQuery: Function;
  handleSearch: (input: string) => void;
};

const SearchInput: FC<Props> = ({ viewType, searchQuery, applySearchQuery, handleSearch }) => {
  const activeTab = useAppSelector(selectActiveTab);
  const userAgency = getUserAgency();
  const isCEEB = activeTab === COMPLAINT_TYPES.ERS && userAgency === "EPO";
  const isNROS = activeTab === COMPLAINT_TYPES.ERS && userAgency === "NROS";
  const [input, setInput] = useState<string>(searchQuery ?? "");

  useEffect(() => {
    if (!searchQuery) {
      setInput("");
    }
  }, [searchQuery]);

  const onSearch = () => {
    if (input.length >= 3) {
      applySearchQuery(input);
      handleSearch(input);
    }
  };

  const handleClear = () => {
    setInput("");
    applySearchQuery(undefined);
  };

  const handleKeyPress = (evt: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { key } = evt;

    if (key.toUpperCase() === "ENTER") {
      onSearch();
    }
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const {
      target: { value },
    } = evt;

    if (!value) {
      handleClear();
    }

    setInput(value);
  };

  const renderTooltip = (props: any) => (
    <Tooltip
      id="search-button-tooltip"
      className="comp-tooltip"
      {...props}
    >
      <div className="complaint-search-fields-tooltip">
        <div className="complaint-search-fields-tooltip-title">Searchable fields:</div>
        <ul className="complaint-search-fields-tooltip-list">
          <li>Complaint #</li>
          <li>Complaint description</li>
          <li>Officer assigned</li>
          <li>Location/address</li>
          <li>Community, Office</li>
          <li>Zone, Region</li>
          <li>Caller name, address, email</li>
          <li>Caller phone numbers</li>
          <li>Organization reporting</li>
          <li>Complaint update</li>
          <li>Call center action update</li>
          {activeTab === COMPLAINT_TYPES.HWCR && (userAgency === "COS" || userAgency === "PARKS") && (
            <div>
              <li>Species</li>
              <li>Nature of complaint</li>
              <li>Attractants</li>
              <li>Outcome by animal: ear tag</li>
            </div>
          )}
          {(activeTab === COMPLAINT_TYPES.ERS || isCEEB || isNROS) && (
            <div>
              <li>Violation type</li>
              <li>Complaint/witness details</li>
            </div>
          )}
          {(activeTab === COMPLAINT_TYPES.HWCR || activeTab === COMPLAINT_TYPES.ERS) &&
            (userAgency === "COS" || userAgency === "PARKS") && <li>COORS number</li>}
          {activeTab === COMPLAINT_TYPES.GIR && <li>GIR type</li>}

          {/* CEEB agency */}
          {(isCEEB || isNROS) && (
            <div>
              <li>Authorization ID</li>
              <li>Unauthorized site ID</li>
              <li>NRIS inspection number</li>
            </div>
          )}
        </ul>
      </div>
    </Tooltip>
  );

  const renderSectorTooltip = (props: any) => (
    <Tooltip
      id="search-button-tooltip"
      className="comp-tooltip"
      {...props}
    >
      <div className="complaint-search-fields-tooltip complaint-search-fields-tooltip-sector">
        <div className="complaint-search-fields-tooltip-title">Searchable fields</div>
        <div className="complaint-search-fields-tooltip-columns">
          <div className="complaint-search-fields-tooltip-column">
            <div className="complaint-search-fields-tooltip-section-heading">All complaint types</div>
            <ul className="complaint-search-fields-tooltip-list-sector">
              <li>Complaint #</li>
              <li>Complaint description</li>
              <li>Officer assigned</li>
              <li>Location summary</li>
              <li>Location address (detailed)</li>
              <li>Community</li>
              <li>Office</li>
              <li>Zone</li>
              <li>Region</li>
              <li>Caller name</li>
              <li>Caller address</li>
              <li>Caller email</li>
              <li>Caller phone numbers</li>
              <li>Organization reporting</li>
              <li>Other reporting details</li>
              <li>Reference number</li>
              <li>Owning agency</li>
              <li>Complaint update</li>
              <li>Call center action update</li>
            </ul>
          </div>
          <div className="complaint-search-fields-tooltip-column complaint-search-fields-tooltip-column-bordered">
            <div className="complaint-search-fields-tooltip-filter-heading complaint-search-fields-tooltip-filter-heading-compact">
              When ERS filter is selected:
            </div>
            <ul className="complaint-search-fields-tooltip-list-sector">
              <li>Violation type</li>
              <li>Complaint/witness details</li>
              <li>Authorization ID</li>
              <li>Unauthorized site ID</li>
              <li>NRIS inspection number</li>
            </ul>
            <div className="complaint-search-fields-tooltip-filter-heading">When HWCR filter is selected:</div>
            <ul className="complaint-search-fields-tooltip-list-sector">
              <li>Species</li>
              <li>Nature of complaint</li>
              <li>Attractants</li>
              <li>Outcome by animal: ear tag</li>
            </ul>
            <div className="complaint-search-fields-tooltip-filter-heading">When GIR filter is selected:</div>
            <ul className="complaint-search-fields-tooltip-list-sector">
              <li>GIR type</li>
            </ul>
          </div>
        </div>
      </div>
    </Tooltip>
  );

  return (
    <InputGroup className="search-input-group">
      <input
        id="complaint-search"
        placeholder="Search..."
        aria-label="Search"
        className="comp-form-control comp-search-input form-control"
        aria-describedby="basic-addon2"
        onChange={(evt) => handleInputChange(evt)}
        onKeyDown={(evt) => handleKeyPress(evt)}
        value={input}
      />
      {input && (
        <CloseButton
          id="clear-search"
          className="clear-search-button"
          onClick={handleClear}
          tabIndex={0}
        ></CloseButton>
      )}
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={activeTab === COMPLAINT_TYPES.SECTOR ? renderSectorTooltip : renderTooltip}
      >
        <button
          id="search-button"
          className="btn text-white"
          onClick={onSearch}
          type="button"
          aria-label="Search"
        >
          <i className="bi bi-search"></i>
        </button>
      </OverlayTrigger>
    </InputGroup>
  );
};

export default SearchInput;
