const logger = require('../index');

Date.prototype.toISOString = jest.fn(() => "2017-06-15T19:03:22.284Z")

beforeEach(() => {
  process.stdout.write = jest.fn()
  process.stderr.write = jest.fn()
})

test('print basic log statement', () => {
  logger.info("test")
  expect(process.stdout.write).toBeCalledWith(`[INFO][2017-06-15T19:03:22.284Z] test\n`)
})

test('print basic warn statement', () => {
  logger.warn("test")
  expect(process.stdout.write).toBeCalledWith(`[WARN][2017-06-15T19:03:22.284Z] test\n`)
})

test('print basic error statement', () => {
  logger.error("test")
  expect(process.stderr.write).toBeCalledWith(`[ERROR][2017-06-15T19:03:22.284Z] test\n`)
})

test('print log statement with alias property', () => {
  let requestId = "1234"
  logger.info("test", { requestId })
  expect(process.stdout.write).toBeCalledWith(`[INFO][2017-06-15T19:03:22.284Z][rid: ${requestId}] test\n`)
})

test('print debug statement with more than one alias property', () => {
  let requestId = "1234"
  let sourceIp = "192.168.0.1"
  logger.debug("test", { requestId, sourceIp })
  expect(process.stdout.write).toBeCalledWith(`[DEBUG][2017-06-15T19:03:22.284Z][ip: ${sourceIp}][rid: ${requestId}] test\n`)
})

test('print error statement with more than mixed properties', () => {
  let requestId = "1234"
  let testId = 2
  logger.error("test", { requestId, testId })
  expect(process.stderr.write).toBeCalledWith(`[ERROR][2017-06-15T19:03:22.284Z][rid: ${requestId}][testId: ${testId}] test\n`)
});

test('print log statement with overlapping alias', () => {
  let requestId = "1234"
  let awsRequestId = "5678"
  logger.info("test", { requestId, awsRequestId })
  expect(process.stdout.write).toBeCalledWith(`[INFO][2017-06-15T19:03:22.284Z][rid: ${awsRequestId}][rid: ${requestId}] test\n`)
})

test('use default start statement', () => {
  let requestId = "1234"
  logger.logRequestStart('Mozilla', {test: 'test'}, { requestId })
  expect(process.stdout.write).toBeCalledWith(`[INFO][2017-06-15T19:03:22.284Z][rid: ${requestId}] Request started for user: Mozilla, with parameters: {\"test\":\"test\"}\n`)
})

test('truncate long parameters', () => {
  let requestId = '1234'
  logger.logRequestStart('Mozilla', {test: 't'.repeat(101)}, { requestId })
  expect(process.stdout.write).toBeCalledWith(`[INFO][2017-06-15T19:03:22.284Z][rid: ${requestId}] Request started for user: Mozilla, with parameters: {\"test\":\"${'t'.repeat(100)}...\"}\n`)
})

test('test metric logger', () => {
  let requestId = '1234'
  logger.metric({duration: 123123123}, { requestId })
  expect(process.stdout.write).toBeCalledWith(`[METRIC][2017-06-15T19:03:22.284Z][rid: ${requestId}] (duration: 123123123)\n`)
})