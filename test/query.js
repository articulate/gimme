const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('query', () => {
  const body  = { baz: 'bop' }
  const res   = property()

  beforeEach(() => {
    res(undefined)
  })

  describe('validation', () => {
    beforeEach(() =>
      gimme({ query: 'not an object', url }).catch(res)
    )

    it('must be an object', () => {
      expect(res()).to.be.a('Error')
      expect(res().message).to.include('"query" must be an object')
    })
  })

  describe('when not supplied', () => {
    const query = undefined

    describe('and url already includes a query string', () => {
      beforeEach(() =>
        gimme({ query, url: `${url}?color=red` }).then(res)
      )

      it('uses the existing string', () => {
        expect(res().body.query).to.eql({ color: 'red' })
      })
    })
  })

  describe('when supplied', () => {
    const query = { foo: 'bar' }

    describe('and method is GET', () => {
      beforeEach(() =>
        gimme({ query, url }).then(res)
      )

      it('serializes `query` as query params', () =>
        expect(res().body.query).to.eql(query)
      )
    })

    describe('and method is not GET', () => {
      beforeEach(() =>
        gimme({ body, query, method: 'POST', url }).then(res)
      )

      it('serializes `query` as query params', () => {
        expect(res().body.query).to.eql(query)
        expect(res().body.body).to.eql(body)
      })
    })

    describe('and url already includes a query string', () => {
      beforeEach(() =>
        gimme({ query, url: `${url}?color=red` }).then(res)
      )

      it('merges the new `query` onto the existing string', () => {
        expect(res().body.query).to.eql({
          color: 'red',
          foo: 'bar'
        })
      })
    })
  })
})
