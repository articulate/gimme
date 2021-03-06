const nock = require('nock')
const qs   = require('qs')
const spy  = require('@articulate/spy')
const URL  = require('url')

const { curry, compose, prop } = require('ramda')

const portly = 'http://ported.com:1234'
const surl   = 'https://secure.com'
const url    = 'http://regular.com'

Object.assign(exports, { portly, surl, url })

const parseQuery = compose(qs.parse, prop('query'), URL.parse)

const respond = curry(function(method, uri, body) {
  const resBody = {
    body,
    headers: this.req.headers,
    method,
    query: parseQuery(uri),
    uri
  }

  const headers = {
    'content-length': JSON.stringify(resBody).length
  }

  return [ 200, resBody, headers ]
})

console.warn = spy()
nock.disableNetConnect()

beforeEach(() => {
  nock(portly).get('/').query(true).reply(respond('GET'))
  nock(surl).get('/').query(true).reply(respond('GET'))
  nock(url).get('/').query(true).reply(respond('GET'))
  nock(url).post('/').query(true).reply(respond('POST'))
  nock(url).get('/error').query(true).reply(400)
  nock(url).get('/no-length').query(true).reply(200, { foo: 'bar' })
  nock(url).get('/non-json-error').query(true).reply(400, 'string error')
  nock(url).get('/timeout').query(true).socketDelay(1500).reply(200)
})

afterEach(() =>
  nock.cleanAll()
)
