const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('timeout', () => {
  const res = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('when not supplied', () => {
    beforeEach(() =>
      gimme({ url: `${url}/timeout` }).then(res)
    )

    it('defaults to 0 (no timeout)', () => {
      expect(res().statusCode).to.equal(200)
    })
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({ url: `${url}/timeout`, timeout: 250 }).catch(res)
    )

    it('applies the timeout to the socket', () => {
      expect(res()).to.be.an('Error')
      expect(res().code).to.equal('ECONNRESET')
    })
  })
})
