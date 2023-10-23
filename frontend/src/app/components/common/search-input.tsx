import { ChangeEvent, FC, KeyboardEvent, useContext, useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
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

  // const handleSearch = (evt: any): void => {
  //   const {
  //     target: { value },
  //   } = evt;

  //   //-- apply the search query value and pass it up to the complaints component
  //   //-- this is requried so that the pager has a query value it can use
  //   applySearchQuery(value);

  //   if (value.length >= 3) {
  //     let payload = generateComplaintRequestPayload(
  //       complaintType,
  //       filters,
  //       1,
  //       50,
  //       "incident_reported_utc_timestmp",
  //       SORT_TYPES.DESC
  //     );

  //     payload = { ...payload, query: value };

  //     dispatch(getComplaints(complaintType, payload));
  //   }

  //   if(!value){
  //     applySearchQuery(undefined)
  //   }
  // };

  return (
    <InputGroup>
      <FormControl
        placeholder="Search..."
        aria-label="Search"
        className="comp-form-control"
        aria-describedby="basic-addon2"
        onChange={(evt) => handleInputChange(evt)}
        onKeyDown={(evt) => handleKeyPress(evt)}
        defaultValue={input}
      />
    </InputGroup>
  );
};

export default SearchInput;
