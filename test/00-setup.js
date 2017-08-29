const nock     = require('nock')
const qs       = require('qs')
const URL      = require('url')

const { compose, prop } = require('ramda')

const surl = exports.surl = 'https://articulate.com'
const url  = exports.url  = 'http://articulate.com'

const parseQuery = compose(qs.parse, prop('query'), URL.parse)

const respond = function(uri, body) {
  return [ 200, {
    body,
    headers: this.req.headers,
    method: this.req.method,
    query: parseQuery(uri),
    uri
  } ]
}

beforeEach(() => {
  nock(surl).get('/').query(true).reply(respond)
  nock(url).get('/').query(true).reply(respond)
  nock(url).post('/').query(true).reply(respond)
})

afterEach(() =>
  nock.cleanAll()
)
