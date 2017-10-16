const Boom = require('boom')

const wrapError = context => {
  const { statusCode, statusMessage } = context.res
  return Boom.create(statusCode, statusMessage, context)
}

module.exports = wrapError
