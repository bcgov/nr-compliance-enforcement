import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import config from '../../../config';
import { CodeTable } from '../../../enum/code-table.enum';

interface Option {
  complaint_status_code: string;
  long_description: string;
}

type Props = {
  width?: string;
  height?: string;
  onSelectChange: (selectedValue: string) => void;
};

const ComplaintStatusSelect: React.FC<Props> = ({ width, height, onSelectChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Fetch data using Axios
    const token = localStorage.getItem("user");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.get(`${config.API_BASE_URL}/v1/${CodeTable.COMPLAINT_STATUS_CODE}`)
      .then(response => {
        setOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching options:', error);
      });
  }}, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelectChange(value); // Invoking the callback function with the selected value
  };

  return (
    <div>
      <select id="dropdown" value={selectedValue} style={{'width': width, 'height': height}} onChange={handleSelectChange}>
        <option value="">Select</option>
        {options.map(option => (
          <option key={option.complaint_status_code} value={option.complaint_status_code}>{option.long_description}</option>
        ))}
      </select>
    </div>
  );
};

export default ComplaintStatusSelect;

