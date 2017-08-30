const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('method', () => {
  const method = 'POST'
  const res = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    describe('type', () => {
      beforeEach(() =>
        gimme({ method: true, url }).catch(res)
      )

      it('must be a string', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"method" must be a string')
      })
    })

    describe('valid values', () => {
      beforeEach(() =>
        gimme({ method: 'GIT-ER-DUN', url }).catch(res)
      )

      it('must be a valid http method', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"method" must be one of')
      })
    })
  })

  describe('when absent', () => {
    beforeEach(() =>
      gimme({ url }).then(res)
    )

    it('defaults to GET', () =>
      expect(res().body.method).to.equal('GET')
    )
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({ method, url }).then(res)
    )

    it('uses that http method', () =>
      expect(res().body.method).to.equal(method)
    )
  })
})
