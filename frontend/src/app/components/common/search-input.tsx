import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchInput: React.FC = () => {
  return (
    <InputGroup>
      <FormControl
        placeholder="Search..."
        aria-label="Search"
        className="comp-form-control"
        aria-describedby="basic-addon2"
      />
    </InputGroup>
    
  );
};

export default SearchInput;
