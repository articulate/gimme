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

  describe('when absent', () => {
    beforeEach(() =>
      gimme({ url }).then(res)
    )

    it('defaults to `JSON.parse`', () =>
      expect(res().body.uri).to.equal('/')
    )
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({ deserialize: identity, url }).then(res)
    )

    it('deserializes correctly', () =>
      expect(res().body).to.equal('{"body":"","headers":{"content-type":"application/json","host":"articulate.com"},"query":{},"uri":"/"}')
    )
  })
})