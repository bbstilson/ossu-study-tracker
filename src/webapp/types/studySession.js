// @flow

import type { Course } from './course.js';

export type StudySession = {
  id: string,
  course_id: string,
  session_complete: boolean,
  time_start: Date,
  duration: number,
  difficulty: ?number
}

export type StudySessionDuration = {
  id: string,
  value: number,
  course: Course
}
