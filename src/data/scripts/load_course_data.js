const axios = require('axios');
const path = require('path');
const readline = require('linebyline');

readline(path.join(__dirname, '..', 'course_data.txt'))
  .on('line', (line, lineCount) => {
    const [ position, title, duration, effort, link ] = line.split('|').map(_ => _.trim())

    const post_body = {
      position,
      title,
      duration,
      effort,
      link,
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
