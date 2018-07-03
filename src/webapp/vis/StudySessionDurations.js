import { getCoursesData, getStudySessionsDurations } from '../utils/elasticsearch.js';
import { formatDuration } from '../utils/format.js';

import { List as IList, Map as IMap } from 'immutable';
import React, { Fragment, Component } from 'react';

/**
 * Takes a key and an optional value to convert a list of objects to an object
 * of { key: object[value] || object }.
 * Expects an Immutable.Map as the accumulator.
 * @param {string} key - The key from each object to use as the primary key.
 * @param {string?} value - The optional value to grab from the object.
 * @returns {function} - A thunk which takes the accumulator and each object and
 * applies the specified transformation.
 */
const reducer = (key, value) => (map, x) => map.set(x[key], value ? x[value] : x);

export default class StudySessionDurations extends Component {
  state = {
    sessions: []
  }

  async componentWillMount() {
    const sessionDurations = IList(await getStudySessionsDurations());
    const courseDataMap = IList(await getCoursesData(sessionDurations.map(({ key }) => key)))
      .reduce(reducer('_id', '_source'), IMap());

    const sessions = sessionDurations
      .reduce(reducer('key', 'total_duration'), IMap())
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
