// @flow

import type { List } from 'immutable';
import type { EsQuery, EsResponse, EsHits, EsDocs, EsAggs } from '../types/elasticsearch.js';
import type { Course } from '../types/course.js';
import type { StudySession } from '../types/studySession.js';
import type { StudySessionAndCourse } from '../types/generic.js';

import CourseModel from '../models/course';
import StudySessionModel from '../models/study_session';

import axios from 'axios';
import * as Immutable from 'immutable';

const ES_HOST = 'http://localhost:9200';

export function getHits(response: EsResponse): EsHits {
  return response.data.hits.hits;
}

export function getDocs(response: EsResponse): EsDocs {
  return response.data.docs;
}

export function getAggregations(response: EsResponse): EsAggs {
  return response.data.aggregations;
}

export function getCoursesData(courseIds: List<number>): EsDocs {
  return axios.post(`${ES_HOST}/courses/_mget`, {
    docs: courseIds.map((_id) => ({ _id, _type: 'course' }))
  }).then(getDocs);
}

/**
 * @param {Query} query - The query to post to the study_sessions index.
 * @returns {Object[]} - Array({ session, course })
 */
export async function getStudySessionsWithCourseData(
  query: EsQuery
): Promise<StudySessionAndCourse[]> {
  const allStudySessions = await axios.post(`${ES_HOST}/study_sessions/_search`, query).then(getHits);
  const courseData = await getCoursesData(Immutable.List(allStudySessions.map(({ _source }) => _source.course_id)));

  return allStudySessions
    .map((session, idx) => [session, courseData[idx]])  
    .map(([ session, course ]) => ({
      session: StudySessionModel.fromJS(session),
      course: CourseModel.fromJS(course)
    }));
}

export async function endStudySession(
  session: StudySession,
  time_end: number,
  difficulty: number = 1
): Promise<any> {
  const update_request = {
    doc: {
      difficulty,
      duration: time_end - session.time_start,
      session_complete: true,
    }
  };

  return axios.post(`${ES_HOST}/study_sessions/study_session/${session.id}/_update`, update_request);
}

export async function getCourses(query: EsQuery): Promise<EsHits> {
  return axios.post(`${ES_HOST}/courses/_search`, query)
    .then(getHits);
}

export async function setCourseCompleted(
  course: Course,
  difficulty: number = 1
): Promise<any> {
  const update_request = {
    doc: {
      difficulty,
      completed: true,
      completed_on: new Date().getTime()
    }
  };

  return axios.post(`${ES_HOST}/courses/course/${course.id}/_update`, update_request);
}


export async function addCourse(course: Course): Promise<any> {
  delete course.id;
  return axios.post(`${ES_HOST}/courses/course/`, course);
}


export async function getStudySessionsDurations(): Promise<Object> {
  const aggregationQuery = {
    "aggs": {
      "courses": {
        "terms": {
          "field": "course_id"
        },
        "aggs": {
          "total_duration": {
            "sum": {
              "field": "duration"
            }
          }
        }
      }
    }
  };

  const { courses: { buckets: sessionsData }} = await axios
    .post(`${ES_HOST}/study_sessions/_search`, aggregationQuery)
    .then(getAggregations);

  return sessionsData;
}
