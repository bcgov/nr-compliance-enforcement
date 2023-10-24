import { ChangeEvent, FC, KeyboardEvent, useContext, useState, useEffect } from "react";
import { InputGroup } from "react-bootstrap";
import { ComplaintFilterContext } from "../../providers/complaint-filter-provider";
import { getComplaints } from "../../store/reducers/complaints";
import { generateComplaintRequestPayload } from "../containers/complaints/complaint-list";
import { useAppDispatch } from "../../hooks/hooks";
import { SORT_TYPES } from "../../constants/sort-direction";

type Props = {
  complaintType: string;
  searchQuery: string | undefined;
  applySearchQuery: Function;
};

const SearchInput: FC<Props> = ({
  complaintType,
  searchQuery,
  applySearchQuery,
}) => {
  const dispatch = useAppDispatch();
  const { state: filters } = useContext(ComplaintFilterContext);

  const [input, setInput] = useState<string>("");

  useEffect(() => { 
    if(!searchQuery){
      setInput("")
    } 
  }, [searchQuery])

  const handleSearch = () => {
    if (input.length >= 3) {
      applySearchQuery(input);

      let payload = generateComplaintRequestPayload(
        complaintType,
        filters,
        1,
        50,
        "incident_reported_utc_timestmp",
        SORT_TYPES.DESC
      );

      payload = { ...payload, query: input };

      dispatch(getComplaints(complaintType, payload));
    }
  };

  const handleClear = () => {
    applySearchQuery(undefined);
  };

  const handleKeyPress = (
    evt: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { key } = evt;

    if (key.toUpperCase() === "ENTER") {
      handleSearch();
    }
  };

  const handleInputChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const {
      target: { value },
    } = evt;

    if (!value) {
      handleClear();
    } 
    
    setInput(value);
  };

  return (
    <InputGroup>
      <input
        id="complaint-search"
        placeholder="Search..."
        aria-label="Search"
        className="comp-form-control"
        aria-describedby="basic-addon2"
        onChange={(evt) => handleInputChange(evt)}
        onKeyDown={(evt) => handleKeyPress(evt)}
        value={input}
      />
    </InputGroup>
  );
};

export default SearchInput;
