const { composeP } = require('ramda')
const http         = require('http')
const Joi          = require('joi')
const { validate } = require('@articulate/funky')

const gimme = require('./lib/gimme')

const schema = Joi.object({
  body:        Joi.any(),
  data:        Joi.any(), // deprecated
  deserialize: Joi.func(),
  headers:     Joi.object(),
  json:        Joi.boolean(),
  jwt:         Joi.string(),
  method:      Joi.string().valid(http.METHODS),
  serialize:   Joi.func(),
  stream:      Joi.boolean(),
  url:         Joi.string().required(),
  query:       Joi.object(),
})

module.exports = composeP(gimme, validate(schema))
