const { composeP } = require('ramda')
const http         = require('http')
const Joi          = require('joi')
const { validate } = require('@articulate/funky')

const send = require('./lib/send')

const schema = Joi.object({
  data:        Joi.any(),
  deserialize: Joi.func(),
  json:        Joi.boolean(),
  jwt:         Joi.string(),
  method:      Joi.string().valid(http.METHODS),
  serialize:   Joi.func(),
  stream:      Joi.boolean(),
  url:         Joi.string().required()
})

const request = composeP(send, validate(schema))

module.exports = request
