import CourseModel from '../models/course';
import StudySessionModel from '../models/study_session';

import axios from 'axios';

export const ES_HOST = 'http://localhost:9200';

export function getHits(resp) {
  return resp.data.hits.hits;
}

/**
 * @param {Object} query - The query to post to the study_sessions index.
 * @returns {Object[]} - Array({ session, course })
 */
export function getStudySessionsWithCourseData(query) {
  return axios.post(`${ES_HOST}/study_sessions/_search`, query)
    .then(getHits)
    .then((activeSessions) => {
      const docs = activeSessions.map((session) => ({
        _type: 'course',
        _id: session._source.course_id
      }));

      if (docs.length) {
        return axios.post(`${ES_HOST}/courses/_mget`, { docs })
          .then(({ data }) => {
            return {
              courses: data.docs,
              activeSessions
            };
          });
      } else {
        return Promise.resolve({
          activeSessions: [],
          courses: []
        })
      }

    })
    .then(({ activeSessions, courses }) => {
      return activeSessions
        .map((session, idx) => [session, courses[idx]])
        .map(([ session, course ]) => ({
          session: StudySessionModel.fromJS(session),
          course: CourseModel.fromJS(course)
        }));
    });
}

export function endStudySession(session, time_end, difficulty = 1) {
  const update_request = {
    doc: {
      difficulty,
      time_end,
      session_complete: true,
    }
  };

  return axios.post(`${ES_HOST}/study_sessions/study_session/${session.id}/_update`, update_request);
}

export function getCourses(query) {
  return axios.post(`${ES_HOST}/courses/_search`, query)
    .then(getHits);
}

export function setCourseCompleted(course, difficulty = 1) {
  const update_request = {
    doc: {
      difficulty,
      completed: true,
      completed_on: new Date().getTime()
    }
  };

  return axios.post(`${ES_HOST}/courses/course/${course.id}/_update`, update_request);
}


export function addCourse(courseData) {
  return axios.post(`${ES_HOST}/courses/course/`, courseData);
}
