// @flow

import type { Course } from './course.js';
import type { StudySession } from './studySession.js';

export type StudySessionAndCourse =
  & { session: StudySession }
  & { course: Course }
