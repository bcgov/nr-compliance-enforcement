import React, { useState } from 'react';

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

const getOrgsJSON = function(): Promise<void> {

  let token = localStorage.getItem("user");
  
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  
  let config = {method: 'get',
  maxBodyLength: Infinity,
  url: `${process.env.REACT_APP_API_URL}/v1/geo-organization-unit-code`};

  return axios.request(config)
  .then((response) => {
    let jsonResponseTextArea : HTMLInputElement = (document.getElementById('jsonResponse') as HTMLInputElement);
    jsonResponseTextArea.value=JSON.stringify(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
}

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
      <div>
        <button
            className={styles.button}
            onClick={() => getOrgsJSON()}
          >
            Get Organization Units
          </button>

      </div>
      <div>
          <textarea cols={200} id="jsonResponse"></textarea> 
      </div>
    </div>
  );
}
