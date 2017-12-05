const http  = require('http')
const https = require('https')
const qs    = require('qs')
const URL   = require('url')
const { Readable } = require('stream')

const {
  assoc, assocPath, evolve, flip, identity, is,
  length, merge, pick, pipe, replace, when
} = require('ramda')

const parseBody  = require('./parseBody')
const streamBody = require('./streamBody')
const wrapError  = require('./wrapError')

const redact = evolve({ 'authorization': replace(/\s(.*)/, ' REDACTED') })

const clean = pipe(
  pick(['body', 'headers', 'statusCode', 'statusMessage']),
  evolve({ headers: redact })
)

const parseJSON = when(length, JSON.parse)

const gimme = opts => {
  const { json = true } = opts

  const {
    data,
    deserialize = json ? parseJSON : identity,
    jwt,
    method      = 'GET',
    serialize   = json ? JSON.stringify : identity,
    stream      = false,
    url,
    query,
  } = opts

  const headers = merge({}, opts.headers)

  const { auth, hostname, pathname, port, protocol } = URL.parse(url)

  if (json) headers['content-type']  = 'application/json'
  if (jwt)  headers['authorization'] = `Bearer ${jwt}`

  const searchParams = method === 'GET' ?
    (query || data) :
    query

  const search = searchParams == null ? '' : `?${qs.stringify(searchParams)}`

  const path = pathname + search

  const params = { auth, headers, hostname, method, path, port, protocol }

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

module.exports = gimme
