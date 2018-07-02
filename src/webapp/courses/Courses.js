import CollapsibleContainer from '../util/CollapsibleContainer.js';

import CourseModel from '../models/course';
import { getCourses, setCourseCompleted } from '../utils/elasticsearch';

import axios from 'axios';
import classnames from 'classnames';
import format from 'date-fns/format';
import React, { PureComponent } from 'react';

import './Courses.css';

const FilterType = {
  ALL: 'ALL',
  COMPLETED: 'COMPLETED',
  UNCOMPLETED: 'UNCOMPLETED'
};

function FilterButton({ active, children, onClick, filter }) {
  return (
    <span
      className={classnames('filter-button', { 'filter-active': active })}
      onClick={() => { onClick(filter) }}
    >
      {children}
    </span>
  );
}

function isFiltered(filterType, { completed }) {
  switch (filterType) {
    case FilterType.COMPLETED:
      return completed;
    case FilterType.UNCOMPLETED:
      return !completed;
    default:
      return true;
  }
}

function matchesInput(input, { title }) {
  return title.toLowerCase().includes(input.toLowerCase());
}

function Note() {
  return (
    <p>When you're done with all these, that's amazing, but this is just the core stuff. Go <a target="blank" href="https://github.com/ossu/computer-science/blob/dev/README.md#advanced-cs">here</a> and follow the instructions to do the advanced stuff.</p>
  );
}

export default class Courses extends PureComponent {
  state = {
    courses: [],
    error: null,
    filterType: FilterType.ALL,
    input: ''
  }

  componentDidMount() {
    const match_all_query = {
      query: { match_all: {}},
      size: 100
    };

    getCourses(match_all_query)
      .then((courses) => {
        this.setState({
          courses: courses.map(CourseModel.fromJS)
        });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  handleStartStudying = (courseId) => {
    const now = new Date().getTime();

    const study_session = {
      course_id: courseId,
      session_complete: false,
      time_start: now,
      difficulty: 0
    };

    axios.post('http://localhost:9200/study_sessions/study_session/', study_session)
      .then(({ data }) => {
        console.log('Successfully started studying.', data);
        location.reload(); // eslint-disable-line no-restricted-globals
      })
      .catch((error) => {
        console.error('There was an error: ', error);
        this.setState({ error });
      })
  }

  handleCourseComplete = (course) => {
    setCourseCompleted(course)
      .then(() => {
        console.log('success!');
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }

  handleFilter = (filterType) => {
    this.setState({ filterType });
  }

  render() {
    const { filterType, courses, input } = this.state;

    return (
      <div>
        <h1>All Courses</h1>
        <CollapsibleContainer>
          <div className="input">
            <input
              placeholder="Filter courses"
              onChange={(e) => {
                this.setState({ input: e.target.value });
              }}
            />
          </div>
          <div className="input">
            <FilterButton
              active={filterType === FilterType.ALL}
              filter={FilterType.ALL}
              onClick={this.handleFilter}
            >
              All
            </FilterButton>
            <FilterButton
              active={filterType === FilterType.COMPLETED}
              filter={FilterType.COMPLETED}
              onClick={this.handleFilter}
            >
              Completed
            </FilterButton>
            <FilterButton
              active={filterType === FilterType.UNCOMPLETED}
              filter={FilterType.UNCOMPLETED}
              onClick={this.handleFilter}
            >
              Uncompleted
            </FilterButton>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Link</th>
                <th>Duration</th>
                <th>Effort</th>
                <th>Study</th>
                <th>Complete</th>
                <th>Completed On</th>
              </tr>
            </thead>
            <tbody>
              {courses
                .filter((course) =>
                  isFiltered(filterType, course) &&
                  matchesInput(input, course)
                )
                .sort((a, b) => a.position - b.position)
                .map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td><a href={course.link} target="blank">Course Link</a></td>
                    <td>{course.duration}</td>
                    <td>{course.effort}</td>
                    <td>
                      {!course.completed ? (
                        <button onClick={() => { this.handleStartStudying(course.id); }}>
                          Start Studying
                        </button>
                      ) : '🎉'}
                    </td>
                    <td>
                      {!course.completed ? (
                        <button onClick={() => { this.handleCourseComplete(course); }}>
                          Mark Complete
                        </button>
                      ) : '🎉'}
                    </td>
                    <td>
                      {course.completed ? format(+course.completed_on, 'dddd, MM/DD/YY h:mm A') : ''}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <Note />
        </CollapsibleContainer>
      </div>
    );
  }
}
