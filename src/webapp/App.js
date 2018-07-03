// @flow

import ActiveStudySessions from './study_sessions/ActiveStudySessions';
import StudySessions from './study_sessions/StudySessions';
import Courses from './courses/Courses';
import NewCourse from './courses/NewCourse';

import React from 'react';

import './App.css';

export default function App() {
  return (
    <div className="App">
      <ActiveStudySessions />
      <Courses />
      <StudySessions />
      <NewCourse />
    </div>
  );
};
