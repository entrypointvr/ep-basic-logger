# Entrypoint Basic Logger

This is a super basic logger that can be used with Lambdas or with other projects.
It relies on `winston` as the logging library and by default only prints to standard out
and standard error.

## Installation
1. Add `git+ssh://github.com/entrypointvr/ep-basic-logger.git#VERISON` to your package.json
1. `const logger = require('ep-basic-logger')`

## Usage
The basic logger exports a single logger by default. It supports all 4 usual logging 
levels:
* debug
* info
* warn
* error

Use the logger like this:

```logger.info("my log message", { additionalProperty: "2", requestId: "3"})```
 
This will print:

```[INFO][2017-06-15T19:03:22.284Z][additionalProperty: 2][rid: 3] my log message```

Note that some properties have an alias which is printed instead of the object key. The object key is
case sensitive. Currently it supports `functionName, ip, sourceIp, awsRequestId, requestId, projectId`.
                                                     
Properties with an alias will always appear prior to properties without an alias in the log statement.

## Connecting to Cloudwatch
Cloudwatch is the AWS log aggregation service. It supports out of the box log aggregation for each of
its services either by using direct integration or by piping logs using fluentd or another log
streaming solution.

### ECS
ECS can be configured to automatically pipe logs to cloudwatch in the configuration step
for docker images by using aws logs.

### Lambda
Lambda logs are piped automatically to Cloudwatch under their name. A stream is created for every
instantiation.