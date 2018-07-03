// @flow

import EndSessionModal from './EndSessionModal.js';

import { getStudySessionsWithCourseData, endStudySession } from '../utils/elasticsearch';

import format from 'date-fns/format';
import React, { Component } from 'react';

import type { StudySessionAndCourse } from '../types/generic.js';
import type { StudySession } from '../types/studySession.js';

type ActiveStudySessionsProps = {}
type ActiveStudySessionsState = {
  activeSessions: StudySessionAndCourse[],
  error: Object | null,
  showEndStudyingModal: boolean,
  sessionToStop: StudySession | null,
  loading: boolean,
  endTime: number
}

export default class ActiveStudySessions extends Component<ActiveStudySessionsProps, ActiveStudySessionsState> {
  state = {
    activeSessions: [],
    error: null,
    showEndStudyingModal: false,
    sessionToStop: null,
    loading: true,
    endTime: 0
  }

  componentWillMount() {
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

  displayEndSessionModal = (session: StudySession) => {
    this.setState({
      showEndStudyingModal: true,
      sessionToStop: session,
      endTime: new Date().getTime(),
    });
  }

  handleEndStudying = (difficulty: number) => {
    const { endTime, sessionToStop } = this.state;

    if (!sessionToStop) {
      const message = 'sessionToStop was null';
      console.error(message);
      this.setState({ error: { message }});
      return;
    }

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
      endTime: 0
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
