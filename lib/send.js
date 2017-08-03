const Boom  = require('boom')
const http  = require('http')
const https = require('https')
const qs    = require('qs')
const URL   = require('url')
const { Readable } = require('stream')

const {
  assoc, assocPath, evolve, flip, identity, is,
  merge, pick, pipe, replace
} = require('ramda')

const { parseBody, streamBody } = require('./body')

const redact = evolve({ 'authorization': replace(/\s(.*)/, ' REDACTED') })

const clean = pipe(
  pick(['body', 'headers', 'statusCode', 'statusMessage']),
  evolve({ headers: redact })
)

const send = opts => {
  const { json = true } = opts

  const {
    data,
    deserialize = json ? JSON.parse : identity,
    jwt,
    method      = 'GET',
    serialize   = json ? JSON.stringify : identity,
    stream,
    url
  } = opts

  const headers = merge({}, opts.headers)

  const { auth, host, pathname, port, protocol } = URL.parse(url)

  if (json) headers['content-type']  = 'application/json'
  if (jwt)  headers['authorization'] = `Bearer ${jwt}`

  const path = method === 'GET' && data
    ? `${pathname}?${qs.stringify(data)}`
    : pathname

  const params = { auth, headers, host, method, path, port, protocol }

  return new Promise((resolve, reject) => {
    const respond = res => {
      res.on('error', reject)

      if (res.statusCode >= 400) {
        const context = {
          req: { data, headers: redact(headers), method, url },
          res: clean(res)
        }

        parseBody(deserialize, res)
          .then(flip(assocPath(['res', 'body']))(context))
          .then(wrapError)
          .then(reject, reject)
      } else {
        (stream ? streamBody : parseBody(deserialize))(res)
          .then(flip(assoc('body'))(res))
          .then(clean)
          .then(resolve, reject)
      }
    }

    const req = (protocol === 'https:' ? https : http).request(params, respond)

    req.on('error', reject)

    if (method !== 'GET' && data) {
      if (is(Readable, data)) {
        data.pipe(req)
      } else {
        req.end(serialize(data))
      }
    } else {
      req.end()
    }
  })
}

const wrapError = context => {
  const { statusCode, statusMessage } = context.res
  return Boom.create(statusCode, statusMessage, context)
}

module.exports = send
