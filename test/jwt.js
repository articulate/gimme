const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('jwt', () => {
  const jwt = 'supersecretstring'
  const res = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    beforeEach(() =>
      gimme({ jwt: true, url }).catch(res)
    )

    it('must be a string', () => {
      expect(res()).to.be.a('Error')
      expect(res().message).to.include('"jwt" must be a string')
    })
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({ jwt, url }).then(res)
    )

    it('includes it in the authorization header', () =>
      expect(res().body.headers.authorization).to.equal(`Bearer ${jwt}`)
    )
  })
})
