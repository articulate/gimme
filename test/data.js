const { expect } = require('chai')
const property   = require('prop-factory')

const gimme   = require('..')
const { url } = require('./00-setup')

describe('data', () => {
  const body  = { baz: 'bop' }
  const res   = property()

  beforeEach(() => {
    res(undefined)
  })

  beforeEach(() =>
    gimme({ data: body, method: 'POST', url }).then(res)
  )

  it('is used for non-GET request body', () =>
    expect(res().body.body).to.eql(body)
  )

  it('is deprecated', () =>
    expect(console.warn.calls[0][0]).to.include('deprecated')
  )
})
