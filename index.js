const winston = require("winston")

//lower case list of meta logging attributes
const alias = {
  functionName: 'fn',
  ip: 'ip',
  sourceIp: 'ip',
  awsRequestId: 'rid',
  requestId: 'rid',
  auth: 'tk'
}

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
          }, []).concat(Object.keys(options.meta).map((key) => {
            return `[${alias[key] ? alias[key] : key}: ${options.meta[key]}]`
          }))
        }
        return `[${options.level.toUpperCase()}][${new Date().toISOString()}]${metaData.join('')} ${options.message}`
      }
    })
  ]
})

const MAX_PARAMETER_LENGTH = 100

logger.logRequestStart = function(userAgent, parameters, meta) {
  let shortenedParameters = JSON.stringify(parameters, (key, value) => value.length > MAX_PARAMETER_LENGTH ? `${value.substr(0, MAX_PARAMETER_LENGTH)}...` : value )
  this.info(`Request started for user: ${userAgent}, with parameters: ${shortenedParameters}`, meta)
}

module.exports = logger