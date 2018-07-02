import EndSessionModal from './EndSessionModal.js';

import { getStudySessionsWithCourseData, endStudySession } from '../utils/elasticsearch';

import format from 'date-fns/format';
import React, { PureComponent } from 'react';

export default class ActiveStudySessions extends PureComponent {
  state = {
    activeSessions: [],
    error: null,
    showEndStudyingModal: false,
    sessionIdToStop: null,
    loading: true
  }

  componentDidMount() {
    this.fetchActiveSessions();
  }

  fetchActiveSessions = async () => {
    const active_sessions_query = {
      query: {
        term: {
          session_complete: false
        }
      }
    };

    try {

      this.setState({
        loading: false,
        activeSessions: await getStudySessionsWithCourseData(active_sessions_query)
      });
    } catch(error) {
      this.setState({ error, loading: false });
    }
  }

  displayEndSessionModal = (session) => {
    this.setState({
      showEndStudyingModal: true,
      sessionToStop: session,
      endTime: new Date().getTime(),
    });
  }

  handleEndStudying = (difficulty) => {
    const { endTime, sessionToStop } = this.state;

    endStudySession(sessionToStop, endTime, difficulty)
      .then(() => {
        location.reload(); // eslint-disable-line no-restricted-globals
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  denyEndStudying = () => {
    this.setState({
      showEndStudyingModal: false,
      sessionToStop: null,
      endTime: null
    });
  }

  render() {
    const { activeSessions, showEndStudyingModal, endTime, loading } = this.state;

    return (
      <div>
        <h1>Active Study Sessions</h1>
        {loading && <p>Loading sessions...</p>}
        {activeSessions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Started</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {this.state.activeSessions.map(({ session, course }) => (
                <tr key={session.id}>
                  <td><a href={course.link}>{course.title}</a></td>
                  <td>{format(+session.time_start, 'dddd, MM/DD/YY h:mm A')}</td>
                  <td>
                    <button
                      onClick={() => { this.displayEndSessionModal(session); }}
                    >
                      Stop Studying
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ): <p>No study session in progress.</p>}
        {showEndStudyingModal && (
          <EndSessionModal
            onConfirm={this.handleEndStudying}
            onDeny={this.denyEndStudying}
            endTime={endTime}
          />
        )}
      </div>
    );
  }
}
