const rawBody = require('raw-body')
const typer   = require('media-typer')

const { compose, curry, path } = require('ramda')

const contentLength = compose(parseInt, path(['headers', 'content-length']))
const contentType   = path(['headers', 'content-type'])

const parseBody = (deserialize, res) => {
  const length   = contentLength(res)
  const type     = contentType(res)
  const encoding = type && typer.parse(type).parameters.charset || 'utf8'
  return rawBody(res, { encoding, length }).then(deserialize)
}

module.exports = curry(parseBody)
