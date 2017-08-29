const { expect }  = require('chai')
const property    = require('prop-factory')
const { toUpper } = require('ramda')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('serialize', () => {
  const data      = 'some data'
  const serialize = toUpper
  const res       = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    beforeEach(() =>
      gimme({ serialize: 'not a function', url }).catch(res)
    )

    it('must be a function', () => {
      expect(res()).to.be.a('Error')
      expect(res().message).to.include('"serialize" must be a Function')
    })
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({
        data,
        deserialize: JSON.parse,
        json: false,
        method: 'POST',
        serialize,
        url
      }).then(res)
    )

    it('serializes the data correctly', () =>
      expect(res().body.body).to.equal(serialize(data))
    )
  })
})
