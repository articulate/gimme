const {
  always, assoc, compose, curry, curryN, objOf, path, pathOr
} = require('ramda')

const rawBody = curryN(2, require('raw-body'))
const typer   = require('media-typer')

const contentLength =
  compose(Number, path(['headers', 'content-length']))

const parseBody = (deserialize, res) =>
  Promise.resolve(res)
    .then(typer.parse)
    .then(pathOr('utf8', ['parameters', 'charset']))
    .catch(always('utf8'))
    .then(objOf('encoding'))
    .then(assoc('length', contentLength(res)))
    .then(rawBody(res))
    .then(deserialize)

module.exports = curry(parseBody)
