const chalk = require('chalk')
const http  = require('http')
const https = require('https')
const qs    = require('qs')
const URL   = require('url')
const { Readable } = require('stream')

const {
  assoc, assocPath, evolve, flip, identity, is,
  merge, nthArg, pick, pipe, replace, tryCatch
} = require('ramda')

const { name }   = require('../package')
const parseBody  = require('./parseBody')
const streamBody = require('./streamBody')
const wrapError  = require('./wrapError')

const redact = evolve({ authorization: replace(/\s(.*)/, ' REDACTED') })

const clean = pipe(
  pick(['body', 'headers', 'statusCode', 'statusMessage']),
  evolve({ headers: redact })
)

const parseJSON = tryCatch(JSON.parse, nthArg(1))

const gimme = opts => {
  const {
    data,
    json = true
  } = opts

  if (data) console.warn(chalk.yellow(`[${name}] The 'data' option is deprecated in favor of 'body'.`))

  const {
    body        = data,
    deserialize = json ? parseJSON : identity,
    jwt,
    method      = 'GET',
    serialize   = json ? JSON.stringify : identity,
    stream      = false,
  } = opts

  const headers = merge({}, opts.headers)

  if (json) headers['content-type']  = 'application/json'
  if (jwt)  headers['authorization'] = `Bearer ${jwt}`

  const parsed = URL.parse(opts.url)

  const { auth, hostname, pathname, port, protocol } = parsed

  const query = merge(qs.parse(parsed.query), opts.query)

  const search = Object.keys(query).length > 0
    ? `?${qs.stringify(query)}`
    : ''

  const path = pathname + search

  const params = { auth, headers, hostname, method, path, port, protocol }

  return new Promise((resolve, reject) => {
    const respond = res => {
      res.on('error', reject)

      if (res.statusCode >= 400) {
        const url = URL.format({ auth, hostname, pathname, port, protocol, search })

        const context = {
          req: { body, headers: redact(headers), method, url },
          res: clean(res)
        }

        Promise.resolve(res)
          .then(parseBody(deserialize))
          .then(flip(assocPath(['res', 'body']))(context))
          .then(wrapError)
          .then(reject, reject)
      } else {
        Promise.resolve(res)
          .then(stream ? streamBody : parseBody(deserialize))
          .then(flip(assoc('body'))(res))
          .then(clean)
          .then(resolve, reject)
      }
    }

    const requester = protocol === 'https:' ? https : http
    const req = requester.request(params, respond)

    req.on('error', reject)

    if (method !== 'GET' && body) {
      if (is(Readable, body)) {
        body.pipe(req)
      } else {
        req.end(serialize(body))
      }
    } else {
      req.end()
    }
  })
}

module.exports = gimme
