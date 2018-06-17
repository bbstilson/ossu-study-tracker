import { addCourse } from '../utils/elasticsearch';

import React, { Component } from 'react';

export default class NewCourse extends Component {
  state = {
    courseName: '',
    courseLink: ''
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { courseName, courseLink } = this.state;

    addCourse({
      position: -1, // insert at the beginning
      title: courseName,
      duration: 'N/A',
      effort: 'N/A',
      link: courseLink,
      completed: false
    }).then(({ data }) => {
      console.log('Successfully indexed:', data._id);
      this.setState({
        courseName: '',
        courseLink: ''
      });
    })
    .catch(({ response }) => {
      console.error('POST error: ', response);
    })
  }

  handleCourseNameChange = (e) => {
    this.setState({
      courseName: e.target.value
    })
  }

  handleCourseLinkChange = (e) => {
    this.setState({
      courseLink: e.target.value
    });
  }

  render() {
    const { courseName, courseLink } = this.state;

    return (
      <div>
        <h1>Add Course</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Course Name: </label>
          <input type="text" value={courseName} onChange={this.handleCourseNameChange} />
          <br />
          <label>Course Link: </label>
          <input type="text" value={courseLink} onChange={this.handleCourseLinkChange} />
          <br/>
          <input type="submit" value="Add Course" />
        </form>
      </div>
    );
  }
}
