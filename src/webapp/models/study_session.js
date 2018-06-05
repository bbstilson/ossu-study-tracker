import Immutable from 'immutable';

const StudySession = Immutable.Record({
  id: null,
  course_id: null, // ref -> Course.id
  session_complete: null, // boolean
  time_start: null, // Date
  time_end: null, // Date
  difficulty: null, // 1 - 5
});

StudySession.fromJS = (data) => StudySession({
  id: data._id,
  ...data._source
});

export default StudySession;
