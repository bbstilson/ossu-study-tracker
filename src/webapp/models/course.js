import Immutable from 'immutable';

const Course = Immutable.Record({
  id: null,
  link: null,
  title: null,
  effort: null,
  position: null,
  duration: null,
  completed: null,
  completed_on: null,
  difficulty: null
});

Course.fromJS = (data) => Course({
  id: data._id,
  ...data._source
});

export default Course;
