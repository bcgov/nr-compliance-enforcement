import React, { useState, useEffect } from 'react';
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
};

const ComplaintStatusSelect: React.FC<Props> = ({ width, height }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

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

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <select id="dropdown" value={selectedOption} style={{'width': width, 'height': height}} onChange={handleOptionChange}>
        <option value="">Select</option>
        {options.map(option => (
          <option key={option.complaint_status_code} value={option.complaint_status_code}>{option.long_description}</option>
        ))}
      </select>
    </div>
  );
};

export default ComplaintStatusSelect;

