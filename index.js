const winston = require("winston")

//lower case list of meta logging attributes
const alias = {
  functionName: 'fn',
  ip: 'ip',
  sourceIp: 'ip',
  awsRequestId: 'rid',
  requestId: 'rid',
  auth: 'tk',
  path: 'p'
}

const reserved = new Set(['metrics'])

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      debugStdout: true,
      formatter: function(options) {
        let metaData = []
        if(options.meta) {
          //First iterate through the alias keys and make those go first
          metaData = Object.keys(alias).reduce((acc, key) => {
            if (options.meta.hasOwnProperty(key)) {
              acc.push(`[${alias[key] ? alias[key] : key}: ${options.meta[key]}]`);
              delete options.meta[key]
            }
            return acc;
          }, []).concat(Object.keys(options.meta).reduce((acc, key) => {
            // Don't push the reserved keywords
            if (!reserved.has(key)) {
              acc.push(`[${alias[key] ? alias[key] : key}: ${options.meta[key]}]`)
            }
            return acc
          }, []))
        }
        let level = (options.meta && options.meta.metrics) ? 'METRIC' : options.level.toUpperCase()
        return `[${level}][${new Date().toISOString()}]${metaData.join('')} ${options.message}`
      }
    })
  ]
})

const MAX_PARAMETER_LENGTH = 100

logger.logRequestStart = function(userAgent, parameters, meta) {
  let shortenedParameters = parameters ? JSON.stringify(parameters, (key, value) => value.length > MAX_PARAMETER_LENGTH ? `${value.substr(0, MAX_PARAMETER_LENGTH)}...` : value ) : 'none'
  this.info(`Request started for user: ${userAgent}, with parameters: ${shortenedParameters}`, meta)
}

logger.metric = function(metrics, meta) {
  this.debug(Object.keys(metrics).map(key => `(${key}: ${metrics[key]})`).join(' '), { metrics: true, ...meta })
}

module.exports = logger
