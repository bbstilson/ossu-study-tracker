import ActiveStudySessions from './study_sessions/ActiveStudySessions';
import StudySessions from './study_sessions/StudySessions';
import Courses from './courses/Courses';
import NewCourse from './courses/NewCourse';

import React, { PureComponent } from 'react';

import './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <ActiveStudySessions />
        <Courses />
        <StudySessions />
        <NewCourse />
      </div>
    );
  }
}

export default App;
