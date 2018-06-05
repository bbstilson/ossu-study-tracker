import ActiveStudySessions from './study_sessions/ActiveStudySessions';
import StudySessions from './study_sessions/StudySessions';
import Courses from './courses/Courses';

import React, { PureComponent } from 'react';

import './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <ActiveStudySessions />
        <Courses />
        <StudySessions />
      </div>
    );
  }
}

export default App;
