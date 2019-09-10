const { Agent }  = require('http')
const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('agent', () => {
  let agent
  const res = property()

  beforeEach(() => {
    agent = new Agent({ keepAlive: true })
    res(undefined)
  })

  afterEach(() => {
    agent.destroy()
  })

  describe('when supplied', () => {
    beforeEach(() =>
      gimme({ url, agent }).then(res)
    )

    it('is allowed', () => {
      expect(res().statusCode).to.equal(200)
    })
  })
})
