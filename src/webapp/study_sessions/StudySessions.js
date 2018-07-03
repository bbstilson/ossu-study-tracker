import CollapsibleContainer from '../util/CollapsibleContainer.js';
import StudySessionDurations from '../vis/StudySessionDurations.js';

import { getStudySessionsWithCourseData } from '../utils/elasticsearch.js';
import { formatDuration } from '../utils/format.js';

import React, { PureComponent } from 'react';

export default class StudySessions extends PureComponent {
  state = {
    sessions: []
  }

  async componentWillMount() {
    const complete_sessions_query = {
      query: {
        term: {
          session_complete: true
        }
      },
      size: 100
    };

    try {
      this.setState({
        sessions: await getStudySessionsWithCourseData(complete_sessions_query)
      });
    } catch(error) {
      console.error(error);
      this.setState({ error });
    }
  }
  render() {
    const { sessions } = this.state;

    return (
      <div>
        <h1>All Study Sessions</h1>
        <StudySessionDurations />
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
                  <td>{formatDuration(session.duration)}</td>
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
