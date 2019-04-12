const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('json', () => {
  const res  = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    beforeEach(() =>
      gimme({ json: 'not a boolean', url }).catch(res)
    )

    it('must be a boolean', () => {
      expect(res()).to.be.a('Error')
      expect(res().message).to.include('"json" must be a boolean')
    })
  })

  describe('when absent', () => {
    beforeEach(() =>
      gimme({ url }).then(res)
    )

    it('defaults to true', () =>
      expect(res().body.headers['content-type']).to.equal('application/json')
    )
  })

  describe('when false', () => {
    const body = 'just a string'

    beforeEach(() =>
      gimme({ body, json: false, method: 'POST', url }).then(res)
    )

    it('does not serialize as JSON', () =>
      expect(JSON.parse(res().body).body).to.equal(body)
    )

    it('does not deserialize as JSON', () =>
      expect(res().body).to.be.a('String')
    )

    it('does not set the content-type header', () =>
      expect(JSON.parse(res().body).headers['content-type']).to.be.undefined
    )
  })

  describe('when true', () => {
    const body = { foo: 'bar' }

    beforeEach(() =>
      gimme({ body, json: true, method: 'POST', url }).then(res)
    )

    it('serializes as JSON', () =>
      expect(res().body.body).to.eql(body)
    )

    it('deserializes as JSON', () =>
      expect(res().body).to.an('Object')
    )

    it('sets the content-type header', () =>
      expect(res().body.headers['content-type']).to.equal('application/json')
    )
  })
})
