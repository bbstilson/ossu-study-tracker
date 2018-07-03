// @flow

import { getCoursesData, getStudySessionsDurations } from '../utils/elasticsearch.js';
import { formatDuration } from '../utils/format.js';
import { toImmutableMap } from '../utils/helpers.js';

import type { StudySessionDuration } from '../types/studySession.js';

import type { IndexedSeq } from 'immutable';
import * as Immutable from 'immutable';
import React, { Fragment, Component } from 'react';

type StudySessionDurationProps = {}
type StudySessionDurationsState = {
  sessions: IndexedSeq<StudySessionDuration>
}

export default class StudySessionDurations extends Component<StudySessionDurationProps, StudySessionDurationsState> {
  state = {
    sessions: Immutable.Seq.Indexed()
  }

  async componentWillMount() {
    const sessionDurations = Immutable.List(await getStudySessionsDurations());
    const courseDataMap = Immutable.List(await getCoursesData(sessionDurations.map(({ key }) => key)))
      .reduce(toImmutableMap('_id', '_source'), Immutable.Map());

    const sessions = sessionDurations
      .reduce(toImmutableMap('key', 'total_duration'), Immutable.Map())
      .map((durationData, courseId) => ({
        ...durationData,
        id: courseId,
        course: courseDataMap.get(courseId)
      }))
      .toIndexedSeq()
      .sortBy(({ value }) => value)
      .reverse();

    this.setState({ sessions });
  }

  render() {
    const { sessions } = this.state;

    return (
      <Fragment>
        <table>
          <thead>
            <tr>
              <td>Course</td>
              <td>Total Study Time</td>
            </tr>
          </thead>
          <tbody>
            {sessions.map(({ id, value, course }) => (
              <tr key={id}>
                <td><a href={course.link}>{course.title}</a></td>
                <td>{formatDuration(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
