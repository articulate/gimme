const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('errors', () => {
  const res = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('non JSON formatted error', () => {
    beforeEach(() =>
      gimme({ url: `${url}/non-json-error` }).catch(res)
    )

    it('rejects with an appropriate Boom error', () => {
      expect(res()).to.be.a('Error')
      expect(res().isBoom).to.be.true
      expect(res().output.statusCode).to.equal(400)
      expect(res().data.res.body).to.equal('string error')
      expect(res().cry).to.equal(true)
    })
  })

  describe('when statusCode >= 400', () => {
    beforeEach(() =>
      gimme({ url: `${url}/error` }).catch(res)
    )

    it('rejects with an appropriate Boom error', () => {
      expect(res()).to.be.a('Error')
      expect(res().isBoom).to.be.true
      expect(res().output.statusCode).to.equal(400)
      expect(res().cry).to.equal(true)
    })
  })
})
