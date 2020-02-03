import React from 'react';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Boot from "./redux/boot";
import './App.scss';
import AppRouter from './router';

const DashApp = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

Boot()
  .then(() => DashApp())
  .catch(error => console.error(error));

export default DashApp;
