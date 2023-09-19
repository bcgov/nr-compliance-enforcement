import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';
import { CodeTable } from '../../constants/code-table.enum';
import Select from 'react-select';

interface Option {
  value: string | undefined;
  label: string | undefined;
}

type Props = {
  onSelectChange: (selectedValue: string) => void;
};

const ComplaintStatusSelect: React.FC<Props> = ({onSelectChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    // Fetch data using Axios
    const token = localStorage.getItem("__auth_token");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.get(`${config.API_BASE_URL}/v1/${CodeTable.COMPLAINT_STATUS_CODE}`)
      .then(response => {
        const data = response.data; // Assuming the response is an array of JSON elements

        // Transform the response data into an array of options
        const transformedOptions: Option[] = data.map((item: any) => ({
          value: item.complaint_status_code, // Assuming each item has an 'id' property
          label: item.long_description, // Assuming each item has a 'name' property
        }));
        setOptions(transformedOptions);
      })
      .catch(error => {
        console.error('Error fetching options:', error);
      });
  }}, []);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
    onSelectChange(selectedOption?.value ? selectedOption.value : "");
  }; 

  return (
    <div>

      <Select id="complaint_status_dropdown"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        classNamePrefix="comp-select"
        placeholder="Select"
      />
    </div>
  );
};

export default ComplaintStatusSelect;

