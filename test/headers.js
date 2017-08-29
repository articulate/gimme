const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('headers', () => {
  const headers = { foo: 'bar' }
  const res     = property()

  beforeEach(() => {
    res(undefined)
  })

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
