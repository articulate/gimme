const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('errors', () => {
  const res = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('when statusCode >= 400', () => {
    beforeEach(() =>
      gimme({ url: `${url}/error` }).catch(res)
    )

    it('rejects with an appropriate Boom error', () => {
      expect(res()).to.be.a('Error')
      expect(res().isBoom).to.be.true
      expect(res().output.statusCode).to.equal(400)
    })
  })
})
