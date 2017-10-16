const { PassThrough } = require('stream')

const streamBody = res => {
  const body = new PassThrough()
  res.pipe(body)
  return Promise.resolve(body)
}

module.exports = streamBody
