import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import Board from './components/Board.js';
import UserSetting from './components/UserSetting.js';
import { minesweeperApp } from './redux/reducers.js';
import { createStore } from 'redux';

const store = createStore(minesweeperApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
