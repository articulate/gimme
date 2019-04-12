const { expect } = require('chai')
const property   = require('prop-factory')
const stream     = require('stream')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('query', () => {
  const query = { foo: 'bar' }
  const body  = { baz: 'bop' }
  const res   = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('when method is GET', () => {
    beforeEach(() =>
      gimme({ query, body, url }).then(res)
    )

    it('serializes `query` as query params', () =>
      expect(res().body.query).to.eql(query)
    )
  })

  describe('when method is not GET', () => {
    describe('and body is not a stream', () => {
      beforeEach(() =>
        gimme({ body, query, method: 'POST', url }).then(res)
      )

      it('serializes it in the request body', () => {
        expect(res().body.query).to.eql(query)
        expect(res().body.body).to.eql(body)
      })
    })

    describe('and body is a stream', () => {
      const body  = new stream.PassThrough()
      const value = 'some streamed body'

      beforeEach(() => {
        const promise = gimme({
          body,
          query,
          deserialize: JSON.parse,
          json: false,
          method: 'POST',
          url
        }).then(res)

        body.end(value)
        return promise
      })

      it('pipes the body into the request', () => {
        expect(res().body.query).to.eql(query)
        expect(res().body.body).to.equal(value)
      })
    })
  })
})
