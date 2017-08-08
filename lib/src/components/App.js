import React, { Component } from 'react';
import  Board  from './Board.js';
import  UserSetting from './UserSetting.js';
import '../styles/Styles.css';

/*
---App
 Holds both the user-setting and the board-game sections of the app
*/
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>

          <div className="header">
            <div className="setting-wrapper">
              <UserSetting />
            </div>
          </div>

          <div className="board-wrapper">
            <Board />
          </div>

      </div>
    );
  }
}

export default App;
