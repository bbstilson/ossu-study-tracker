const axios = require('axios');
const path = require('path');
const readline = require('linebyline');

function parseTitleAndLink(str) {
  const [title, link] = str.split('](');
  return [ title.slice(1), link.slice(0, -1) ];
}

function coursePartsToObj([title, link, duration, effort, prerequisites, section]) {
  return { title, link, duration, effort, prerequisites, section };
}

function parseCourse(course) {
  return course
    .split('|')
    .map(_ => _.trim())
    .reduce((data, _, idx) => idx === 0
      ? data.concat(parseTitleAndLink(_))
      : data.concat(_), []);
}

readline(path.join(__dirname, '..', 'course_data.txt'))
  .on('line', (course, position) => {
    const { title, duration, effort, link, prerequisites, section } = coursePartsToObj(parseCourse(course));

    const post_body = {
      title,
      duration,
      effort,
      link,
      prerequisites,
      section,
      position,
      completed: false
    };

    axios.post('http://localhost:9200/courses/course/', post_body)
      .then(({ data }) => {
        console.log('Successfully indexed:', data._id);
      })
      .catch(({ response }) => {
        console.error('POST error: ', response);
      })
  })
  .on('error', function(e) {
    console.error('There was an error: ', e);
  });
