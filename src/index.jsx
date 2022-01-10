import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
