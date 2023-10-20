import { FC, useContext } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { ComplaintFilterContext } from "../../providers/complaint-filter-provider";
import { getComplaints } from "../../store/reducers/complaints";
import { generateComplaintRequestPayload } from "../containers/complaints/complaint-list";
import { useAppDispatch } from "../../hooks/hooks";
import { SORT_TYPES } from "../../constants/sort-direction";

type Props = {
  complaintType: string;
};

const SearchInput: FC<Props> = ({complaintType}) => {
  const dispatch = useAppDispatch();
  const { state: filters } = useContext(ComplaintFilterContext);
  
  const handleSearch = (evt: any): void => {
    const { target: { value } } = evt
    if(value.length >= 3) { 

      const payload = generateComplaintRequestPayload(
        complaintType,
        filters,
        0,
        50,
        "incident_reported_utc_timestmp",
        SORT_TYPES.DESC
      );

      const derp = { ...payload, query: value} 
      
      dispatch(getComplaints(complaintType, derp));
    }
  }

  return (
    <InputGroup>
      <FormControl
        placeholder="Search..."
        aria-label="Search"
        className="comp-form-control"
        aria-describedby="basic-addon2"
        onChange={(evt) => handleSearch(evt)}
      />
    </InputGroup>
  );
};

export default SearchInput;
