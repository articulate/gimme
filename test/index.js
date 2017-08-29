const { expect } = require('chai')
const nock       = require('nock')
const property   = require('prop-factory')
const qs         = require('qs')
const URL        = require('url')

const { compose, identity, prop } = require('ramda')

const gimme = require('..')

const url  = 'http://articulate.com'
const surl = 'https://articulate.com'

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

describe('gimme', () => {
  const res = property()

  beforeEach(() => {
    res(undefined)
    nock(url).get('/').query(true).reply(respond)
    nock(url).post('/').query(true).reply(respond)
  })

  afterEach(() =>
    nock.cleanAll()
  )

  describe('param validation', () => {
    describe('jwt', () => {
      beforeEach(() =>
        gimme({ jwt: true, url }).catch(res)
      )

      it('must be a string', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"jwt" must be a string')
      })
    })

    describe('method', () => {
      describe('type', () => {
        beforeEach(() =>
          gimme({ method: true, url }).catch(res)
        )

        it('must be a string', () => {
          expect(res()).to.be.a('Error')
          expect(res().message).to.include('"method" must be a string')
        })
      })

      describe('valid values', () => {
        beforeEach(() =>
          gimme({ method: 'GIT-ER-DUN', url }).catch(res)
        )

        it('must be a valid http method', () => {
          expect(res()).to.be.a('Error')
          expect(res().message).to.include('"method" must be one of')
        })
      })
    })

    describe('serialize', () => {
      beforeEach(() =>
        gimme({ serialize: 'not a function', url }).catch(res)
      )

      it('must be a function', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"serialize" must be a Function')
      })
    })

    describe('stream', () => {
      beforeEach(() =>
        gimme({ stream: 'not a boolean', url }).catch(res)
      )

      it('must be a string', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"stream" must be a boolean')
      })
    })

    describe('url', () => {
      beforeEach(() =>
        gimme({ url: 42 }).catch(res)
      )

      it('must be a string', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"url" must be a string')
      })
    })
  })

  describe('data', () => {
    const data = { foo: 'bar' }

    describe('when method is GET', () => {
      beforeEach(() =>
        gimme({ data, url }).then(res)
      )

      it('serializes it as query params', () =>
        expect(res().body.query).to.eql(data)
      )
    })

    describe('when method is not GET', () => {
      beforeEach(() =>
        gimme({ data, method: 'POST', url }).then(res)
      )

      it('serializes it in the request body', () =>
        expect(res().body.body).to.eql(data)
      )
    })
  })

  describe('deserialize', () => {
    describe('validation', () => {
      beforeEach(() =>
        gimme({ deserialize: 'not a function', url }).catch(res)
      )

      it('must be a function', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"deserialize" must be a Function')
      })
    })

    describe('when absent', () => {
      beforeEach(() =>
        gimme({ url }).then(res)
      )

      it('defaults to `JSON.parse`', () =>
        expect(res().body.uri).to.equal('/')
      )
    })

    describe('when supplied', () => {
      beforeEach(() =>
        gimme({ deserialize: identity, url }).then(res)
      )

      it('deserializes correctly', () =>
        expect(res().body).to.equal('{"body":"","headers":{"content-type":"application/json","host":"articulate.com"},"query":{},"uri":"/"}')
      )
    })
  })

  describe('headers', () => {
    const headers = { foo: 'bar' }

    describe('validation', () => {
      beforeEach(() =>
        gimme({ headers: 'not an object', url }).catch(res)
      )

      it('must be an object', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"headers" must be an object')
      })
    })

    describe('when supplied', () => {
      beforeEach(() =>
        gimme({ headers, url }).then(res)
      )

      it('includes them in the request', () =>
        expect(res().body.headers).to.include(headers)
      )
    })
  })

  describe('json', () => {
    describe('validation', () => {
      beforeEach(() =>
        gimme({ json: 'not a boolean', url }).catch(res)
      )

      it('must be a boolean', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"json" must be a boolean')
      })
    })

    describe('when absent', () => {
      beforeEach(() =>
        gimme({ url }).then(res)
      )

      it('defaults to true', () =>
        expect(res().body.headers['content-type']).to.equal('application/json')
      )
    })

    describe('when false', () => {
      const data = 'just a string'

      beforeEach(() =>
        gimme({ data, json: false, method: 'POST', url }).then(res)
      )

      it('does not serialize as JSON', () =>
        expect(JSON.parse(res().body).body).to.equal(data)
      )

      it('does not deserialize as JSON', () =>
        expect(res().body).to.be.a('String')
      )

      it('does not set the content-type header', () =>
        expect(JSON.parse(res().body).headers['content-type']).to.be.undefined
      )
    })

    describe('when true', () => {
      const data = { foo: 'bar' }

      beforeEach(() =>
        gimme({ data, json: true, method: 'POST', url }).then(res)
      )

      it('serializes as JSON', () =>
        expect(res().body.body).to.eql(data)
      )

      it('deserializes as JSON', () =>
        expect(res().body).to.an('Object')
      )

      it('sets the content-type header', () =>
        expect(res().body.headers['content-type']).to.equal('application/json')
      )
    })
  })
})
