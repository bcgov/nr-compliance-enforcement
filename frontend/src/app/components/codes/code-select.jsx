import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';
import { CodeTable } from '../../../enum/code-table.enum';

const CodeSelect = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {

      const token = localStorage.getItem("user");
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.get(`${config.API_BASE_URL}/v1/${CodeTable.COMPLAINT_STATUS_CODE}`);
        console.log("Test");
        console.log(response.data);
        setOptions(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <select>
          {options.map(option => (
            <option key={option.complaint_status_code} value={option.long_description}>
              {option.long_description}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CodeSelect;
