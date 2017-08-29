const nock = require('nock')
const qs   = require('qs')
const URL  = require('url')

const { curry, compose, prop } = require('ramda')

const surl = exports.surl = 'https://articulate.com'
const url  = exports.url  = 'http://articulate.com'

const parseQuery = compose(qs.parse, prop('query'), URL.parse)

const respond = curry(function(method, uri, body) {
  return [ 200, {
    body,
    headers: this.req.headers,
    method,
    query: parseQuery(uri),
    uri
  } ]
})

beforeEach(() => {
  nock(surl).get('/').query(true).reply(respond('GET'))
  nock(url).get('/').query(true).reply(respond('GET'))
  nock(url).post('/').query(true).reply(respond('POST'))
  nock(url).get('/error').query(true).reply(400, {})
})

afterEach(() =>
  nock.cleanAll()
)
