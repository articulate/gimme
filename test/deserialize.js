const { expect }   = require('chai')
const { identity } = require('ramda')
const property     = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('deserialize', () => {
  const res  = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    beforeEach(() =>
      gimme({ deserialize: 'not a function', url }).catch(res)
    )

    it('must be a function', () => {
      expect(res()).to.be.a('Error')
      expect(res().message).to.include('"deserialize" must be a Function')
    })
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({ deserialize: identity, url }).then(res)
    )

    it('deserializes correctly', () =>
      expect(res().body).to.equal('{"body":"","headers":{"content-type":"application/json","host":"articulate.com"},"method":"GET","query":{},"uri":"/"}')
    )
  })

  describe('when response has no content-length', () => {
    beforeEach(() =>
      gimme({ deserialize: identity, url: `${url}/no-length` }).then(res)
    )

    it('still parses and deserializes the body', () => {
      expect(res().body).to.equal('{"foo":"bar"}')
      expect(res().headers['content-length']).to.be.undefined
    })
  })
})
