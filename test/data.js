const { expect } = require('chai')
const property   = require('prop-factory')

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
    beforeEach(() =>
      gimme({ data, method: 'POST', url }).then(res)
    )

    it('serializes it in the request body', () =>
      expect(res().body.body).to.eql(data)
    )
  })
})
