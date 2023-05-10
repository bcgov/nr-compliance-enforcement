import React from "react";
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from "./app/store/store"
import App from './app/App';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
