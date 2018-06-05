# Elasticsearch stuff

## Creating indices

This directory contains the mappings for the indicies. There's nothing fancy here. To add the mappings, this curl command was used:

```
curl -X PUT "localhost:9200/INDEX_NAME" -H 'Content-Type: application/json' -d '@INDEX_NAME.json'
```

## Loading data

Study sessions are added by the user (me), but the courses data needs to be loaded. The run the data loading script:

```
node ./scripts/load_course_data.js
```

## Updating index mappings:

```
curl -X PUT 'http://localhost:9200/courses/_mapping/course' -H 'Content-Type: application/json' -d '
{
  "properties": {
    "difficulty": {
      "type": "short"
    }
  }
}
'
```

Be sure to reindex:

```
curl -X POST 'http://localhost:9200/courses/_update_by_query?refresh&conflicts=proceed'
```

