const { composeP } = require('ramda')
const http         = require('http')
const Joi          = require('joi')
const { validate } = require('@articulate/funky')

const gimme = require('./lib/gimme')

const schema = Joi.object({
  agent:       Joi.any(),
  body:        Joi.any(),
  data:        Joi.any(), // deprecated
  deserialize: Joi.func(),
  headers:     Joi.object(),
  json:        Joi.boolean(),
  jwt:         Joi.string(),
  method:      Joi.string().valid(http.METHODS),
  query:       Joi.object(),
  serialize:   Joi.func(),
  stream:      Joi.boolean(),
  timeout:     Joi.number().integer(),
  url:         Joi.string().required(),
})

module.exports = composeP(gimme, validate(schema))
