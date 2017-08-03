const { curryN, path } = require('ramda')
const { PassThrough }  = require('stream')
const rawBody          = require('raw-body')
const typer            = require('media-typer')

const parseBody = curryN(2, (deserialize, res) => {
  const length   = path(['headers', 'content-length'], res)

  if (!length) return streamBody(res)

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
