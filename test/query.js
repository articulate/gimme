const { expect } = require('chai')
const property   = require('prop-factory')
const stream     = require('stream')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('query', () => {
  const query = { foo: 'bar' }
  const data  = { baz: 'bop' }
  const res   = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('when method is GET', () => {
    it('serializes `query` as query params', () =>
      gimme({ query, data, url })
        .then(result => {
          res(result)
          expect(res().body.query).to.eql(query)
        })
    )

    it('serializes `data` as query params when `query` is not defined', () =>
      gimme({ data, url })
        .then(result => {
          res(result)
          expect(res().body.query).to.eql(data)
        })
    )
  })

  describe('when method is not GET', () => {
    describe('and data is not a stream', () => {
      beforeEach(() =>
        gimme({ data, query, method: 'POST', url }).then(res)
      )

      it('serializes it in the request body', () => {
        expect(res().body.query).to.eql(query)
        expect(res().body.body).to.eql(data)
      })
    })

    describe('and data is a stream', () => {
      const data  = new stream.PassThrough()
      const value = 'some streamed data'

      beforeEach(() => {
        const promise = gimme({
          data,
          query,
          deserialize: JSON.parse,
          json: false,
          method: 'POST',
          url
        }).then(res)

        data.end(value)
        return promise
      })

      it('pipes the data into the request', () => {
        expect(res().body.query).to.eql(query)
        expect(res().body.body).to.equal(value)
      })
    })
  })
})
