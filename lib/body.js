const { compose, curryN, path } = require('ramda')
const { PassThrough } = require('stream')
const rawBody         = require('raw-body')
const typer           = require('media-typer')

const contentLength = compose(parseInt, path(['headers', 'content-length']))

const parseBody = curryN(2, (deserialize, res) => {
  const length = contentLength(res)
  if (!length) return Promise.resolve(null)
  const encoding = typer.parse(res).parameters.charset || 'utf8'
  return rawBody(res, { encoding, length }).then(deserialize)
})

const streamBody = res => {
  const body = new PassThrough()
  res.pipe(body)
  return Promise.resolve(body)
}

module.exports = {
  parseBody,
  streamBody
}
