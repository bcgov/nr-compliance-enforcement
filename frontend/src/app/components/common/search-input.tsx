import { ChangeEvent, FC, KeyboardEvent, useState, useEffect } from "react";
import { CloseButton, InputGroup } from "react-bootstrap";

type Props = {
  viewType: "map" | "list";
  searchQuery: string | undefined;
  applySearchQuery: Function;
  handleSearch: (input: string) => void;
};

const SearchInput: FC<Props> = ({ viewType, searchQuery, applySearchQuery, handleSearch }) => {
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
      <button
        id="search-button"
        className="btn text-white"
        onClick={onSearch}
        type="button"
        aria-label="Search"
      >
        <i className="bi bi-search"></i>
      </button>
    </InputGroup>
  );
};

export default SearchInput;
