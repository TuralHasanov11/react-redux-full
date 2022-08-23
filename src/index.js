import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store';
import { Provider } from "react-redux";
import { fetchUsers } from './store/usersSlice';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { apiSlice } from './api/apiSlice';
store.dispatch(fetchUsers())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App/>} />
          </Routes>
        </BrowserRouter>
      </Provider>  
    </ApiProvider>
  </React.StrictMode>
);
