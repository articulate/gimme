const Boom = require('boom')

const wrapError = context => {
  const { statusCode, statusMessage } = context.res
  return new Boom(statusMessage, { data: context, statusCode })
}

module.exports = wrapError
