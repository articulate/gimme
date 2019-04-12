# @articulate/gimme
[![@articulate/gimme](https://img.shields.io/npm/v/@articulate/gimme.svg)](https://www.npmjs.com/package/@articulate/gimme)
[![Build Status](https://travis-ci.org/articulate/gimme.svg?branch=master)](https://travis-ci.org/articulate/gimme)
[![Coverage Status](https://coveralls.io/repos/github/articulate/gimme/badge.svg?branch=master)](https://coveralls.io/github/articulate/gimme?branch=master)

Rest client that goes :boom:

## Usage

```haskell
gimme : { k: v } -> Promise Boom Response
```

Accepts an object of request params, described below.

Returns a [`Promise`](http://devdocs.io/javascript/global_objects/promise) that either resolves with a [`Response`](#response-object), or rejects with an appropriate [`Boom`](https://www.npmjs.com/package/boom) error for the status code of the response.

See the [documentation](https://github.com/articulate/gimme/blob/master/API.md) for more details and examples.
