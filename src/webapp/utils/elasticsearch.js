import CourseModel from '../models/course';
import StudySessionModel from '../models/study_session';

import axios from 'axios';

export const ES_HOST = 'http://localhost:9200';

export function getHits(resp) {
  return resp.data.hits.hits;
}

export function getDocs(resp) {
  return resp.data.docs;
}

/**
 * @param {Object} query - The query to post to the study_sessions index.
 * @returns {Object[]} - Array({ session, course })
 */
export async function getStudySessionsWithCourseData(query) {
  const allStudySessions = await axios.post(`${ES_HOST}/study_sessions/_search`, query).then(getHits);

  const courseData = await axios.post(`${ES_HOST}/courses/_mget`, {
    docs: allStudySessions.map((session) => ({
      _type: 'course',
      _id: session._source.course_id
    }))
  }).then(getDocs);

  return allStudySessions
    .map((session, idx) => [session, courseData[idx]])
    .map(([ session, course ]) => ({
      session: StudySessionModel.fromJS(session),
      course: CourseModel.fromJS(course)
    }));
}

export async function endStudySession(session, time_end, difficulty = 1) {
  const update_request = {
    doc: {
      difficulty,
      duration: time_end - session.time_start,
      session_complete: true,
    }
  };

  return axios.post(`${ES_HOST}/study_sessions/study_session/${session.id}/_update`, update_request);
}

export async function getCourses(query) {
  return axios.post(`${ES_HOST}/courses/_search`, query)
    .then(getHits);
}

export async function setCourseCompleted(course, difficulty = 1) {
  const update_request = {
    doc: {
      difficulty,
      completed: true,
      completed_on: new Date().getTime()
    }
  };

  return axios.post(`${ES_HOST}/courses/course/${course.id}/_update`, update_request);
}


export async function addCourse(courseData) {
  return axios.post(`${ES_HOST}/courses/course/`, courseData);
}
