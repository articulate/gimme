const { expect } = require('chai')
const property   = require('prop-factory')
const stream     = require('stream')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('data', () => {
  const data = { foo: 'bar' }
  const res  = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('when method is GET', () => {
    beforeEach(() =>
      gimme({ data, url }).then(res)
    )

    it('serializes it as query params', () =>
      expect(res().body.query).to.eql(data)
    )
  })

  describe('when method is not GET', () => {
    describe('and data is not a stream', () => {
      beforeEach(() =>
        gimme({ data, method: 'POST', url }).then(res)
      )

      it('serializes it in the request body', () =>
        expect(res().body.body).to.eql(data)
      )
    })

    describe('and data is a stream', () => {
      const data  = new stream.PassThrough()
      const value = 'some streamed data'

      beforeEach(() => {
        const promise = gimme({
          data,
          deserialize: JSON.parse,
          json: false,
          method: 'POST',
          url
        }).then(res)

        data.end(value)
        return promise
      })

      it('pipes the data into the request', () =>
        expect(res().body.body).to.equal(value)
      )
    })
  })
})
