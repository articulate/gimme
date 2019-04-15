const { expect } = require('chai')
const property   = require('prop-factory')
const stream     = require('stream')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('body', () => {
  const body = { foo: 'bar' }
  const res  = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('when body is not a stream', () => {
    beforeEach(() =>
      gimme({ body, method: 'POST', url }).then(res)
    )

    it('serializes it in the request body', () =>
      expect(res().body.body).to.eql(body)
    )
  })

  describe('when body is a stream', () => {
    const body  = new stream.PassThrough()
    const value = 'some streamed body'

    beforeEach(() => {
      const promise = gimme({
        body,
        deserialize: JSON.parse,
        json: false,
        method: 'POST',
        url
      }).then(res)

      body.end(value)
      return promise
    })

    it('pipes the body into the request', () =>
      expect(res().body.body).to.equal(value)
    )
  })
})
