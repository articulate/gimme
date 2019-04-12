const { expect } = require('chai')
const property   = require('prop-factory')
const URL        = require('url')

const gimme = require('..')
const { portly, surl, url } = require('./00-setup')

describe('url', () => {
  const res  = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    describe('presence', () => {
      beforeEach(() =>
        gimme({}).catch(res)
      )

      it('is required', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"url" is required')
      })
    })

    describe('type', () => {
      beforeEach(() =>
        gimme({ url: 42 }).catch(res)
      )

      it('must be a string', () => {
        expect(res()).to.be.a('Error')
        expect(res().message).to.include('"url" must be a string')
      })
    })
  })

  describe('when supplied', () => {
    const parts = URL.parse(url)

    beforeEach(() =>
      gimme({ url }).then(res)
    )

    it('makes the request to that url', () => {
      expect(res().body.uri).to.equal('/')
      expect(res().body.headers['host']).to.equal(parts.host)
    })
  })

  describe('when https used', () => {
    const parts = URL.parse(surl)

    beforeEach(() =>
      gimme({ url: surl }).then(res)
    )

    it('supports that too', () => {
      expect(res().body.uri).to.equal('/')
      expect(res().body.headers['host']).to.equal(parts.host)
    })
  })

  describe('when port included', () => {
    const parts = URL.parse(portly)

    beforeEach(() =>
      gimme({ url: portly }).then(res)
    )

    it('handles the port correctly', () => {
      expect(res().body.uri).to.equal('/')
      expect(res().body.headers['host']).to.equal(parts.host)
    })
  })
})
