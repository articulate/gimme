const Boom = require('boom')

const wrapError = context => {
  const { statusCode, statusMessage } = context.res
  const boom = new Boom(statusMessage, { data: context, statusCode })
  boom.cry = true
  return boom
}

module.exports = wrapError
