const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('data', () => {
  const res = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    beforeEach(() =>
      gimme({ stream: 'not a boolean', url }).catch(res)
    )

    it('must be a boolean', () => {
      expect(res()).to.be.a('Error')
      expect(res().message).to.include('"stream" must be a boolean')
    })
  })

  describe('when absent', () => {
    beforeEach(() =>
      gimme({ url }).then(res)
    )

    it('defaults to false', () =>
      expect(res().body.pipe).not.to.be.a('function')
    )
  })

  describe('when false', () => {
    beforeEach(() =>
      gimme({ stream: false, url }).then(res)
    )

    it('does not stream the response body', () =>
      expect(res().body.pipe).not.to.be.a('function')
    )
  })

  describe('when true', () => {
    beforeEach(() =>
      gimme({ stream: true, url }).then(res)
    )

    it('streams the response body', () =>
      expect(res().body.pipe).to.be.a('function')
    )
  })
})
