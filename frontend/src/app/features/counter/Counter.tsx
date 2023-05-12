import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';
import UserService from '../../service/UserServices';

import axios from 'axios';

interface OrganizationUnitOption {
  geo_organization_unit_code: string;
  short_description: string;
  long_description: string;
}

interface OfficeOption {
  office_guid: string;
  geo_organization_unit_code: {geo_organization_unit_code: string,short_description: string, long_description: string};
  agency_code: {agency_code: string,short_description: string, long_description: string};
}

// temporary react component that renders a list of organizations retrieved from the backend API
const OrganizationCodeDropdown: React.FC = () => {
  const [options, setOptions] = useState<OrganizationUnitOption[]>([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("user");
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
              
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/geo-organization-unit-code`);
        setOptions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label htmlFor="dropdown">Organization Units:</label>
      <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.geo_organization_unit_code} value={option.geo_organization_unit_code}>{option.long_description}</option>
        ))}
      </select>
    </div>
  );
};

// temporary react component that renders a list of organizations retrieved from the backend API
const OfficeDropdown: React.FC = () => {
  const [options, setOptions] = useState<OfficeOption[]>([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("user");
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
              
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/office`);
        setOptions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label htmlFor="dropdown">Offices:</label>
      <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an Office</option>
        {options.map((option) => (
          <option key={option.office_guid} value={option.geo_organization_unit_code.geo_organization_unit_code}>{option.geo_organization_unit_code.long_description}</option>
        ))}
      </select>
    </div>
  );
};

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div>
        Signed in as {UserService.getUsername()}
      </div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span id="counter" className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
        >
          Add If Odd
        </button>
      </div>
      <OrganizationCodeDropdown/>
      <OfficeDropdown/>
    </div>
  );
}