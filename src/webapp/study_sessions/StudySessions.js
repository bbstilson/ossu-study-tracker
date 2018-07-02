import CollapsibleContainer from '../util/CollapsibleContainer.js';

import { getStudySessionsWithCourseData } from '../utils/elasticsearch';

import React, { PureComponent } from 'react';

function formatDuration({ duration }) {
  const durationMinutes = duration / 1000 / 60;

  const remMinutes = Math.floor(durationMinutes % 60);
  const hours = Math.floor(durationMinutes / 60);

  return hours
    ? `${hours}h ${remMinutes}m`
    : `${remMinutes}m`;
}

export default class StudySessions extends PureComponent {
  state = {
    sessions: []
  }

  componentDidMount() {
    const complete_sessions_query = {
      query: {
        term: {
          session_complete: true
        }
      },
      size: 100
    };

    getStudySessionsWithCourseData(complete_sessions_query)
      .then((sessions) => {
        this.setState({ sessions });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }
  render() {
    const { sessions } = this.state;

    return (
      <div>
        <h1>All Study Sessions</h1>
        <CollapsibleContainer>
          <table>
            <thead>
              <tr>
                <td>Course</td>
                <td>Duration</td>
                <td>Difficulty</td>
              </tr>
            </thead>
            <tbody>
              {sessions.map(({ session, course }) => (
                <tr key={session.id}>
                  <td><a href={course.link}>{course.title}</a></td>
                  <td>{formatDuration(session)}</td>
                  <td>{session.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleContainer>
      </div>
    );
  }
}
