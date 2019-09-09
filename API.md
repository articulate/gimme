# API

- [`gimme`](#gimme)
- [`Response` object](#response-object)
- [JSON by default](#json-by-default)
- [Streaming the response](#streaming-the-response)

### gimme

```haskell
gimme : { k: v } -> Promise Boom Response
```

Accepts an object of request params, described below.

Returns a [`Promise`](http://devdocs.io/javascript/global_objects/promise) that either resolves with a [`Response`](#response-object), or rejects with an appropriate [`Boom`](https://www.npmjs.com/package/boom) error for the status code of the response.

The following params are accepted:

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `agent` | [`Agent`](https://devdocs.io/node/http#http_class_http_agent) | | optional shared agent to [manage connection persistence](https://devdocs.io/node/http#http_class_http_agent) |
| `body` | `Any` | | data to serialize and send as the request body |
| `deserialize` | `Function` | [`JSON.stringify`](http://devdocs.io/javascript/global_objects/json/stringify) | function with which to deserialize the response body |
| `headers` | `Object` | `{}` | headers to include on the request |
| `json` | `Boolean` | `true` | if `true`, assumes [json-formatted](#json-by-default) request and response |
| `jwt` | `String` | | [json web token](https://jwt.io/) to include in the `Authorization` header |
| `method` | `String` | `GET` | must be a valid `http` request method |
| `query` | `Object` | | data to serialize and append to the url as a query string |
| `serialize` | `Function` | [`JSON.parse`](http://devdocs.io/javascript/global_objects/json/parse) | function with which to serialize the request body |
| `stream` | `Boolean` | `false` | if `true`, the response `body` will be a [`stream.Readable`](http://devdocs.io/node/stream#stream_class_stream_readable) |
| `timeout` | `Number` | `0` (never) | milliseconds before the [request times out](https://devdocs.io/node/http#http_request_settimeout_timeout_callback) |
| `url` | `String` | | **required:** the `url` of the request |

#### `Response` object

The resolved `Response` object of a successful request is a POJO with the following properties:

| Property | Type | Details |
| -------- | ---- | ------- |
| `body` | `Any` | deserialized response body (see details below) |
| `headers` | `Object` | map of headers, with downcased header names as keys |
| `statusCode` | `Number` | three-digit response status code |
| `statusMessage` | `String` | response status message (reason phrase) |

If `json: true`, the `body` can be any `JSON` serializable type.  If `stream: true`, the `body` will be a [`stream.Readable`](http://devdocs.io/node/stream#stream_class_stream_readable).  Otherwise, the `body` will be a `String`.

#### JSON by default

The `json: true` flag is set by default, which has the following effects on the request:

- `deserialize` defaults to [`JSON.stringify`](http://devdocs.io/javascript/global_objects/json/stringify)
- `serialize` defaults to [`JSON.parse`](http://devdocs.io/javascript/global_objects/json/parse)
- The `content-type` header is forced to `application/json`

Setting `json: false` prevents the effects listed above if desired.

#### Streaming the response

Setting `stream: true` will return a [`Response`](#response-object) with [`stream.Readable`](http://devdocs.io/node/stream#stream_class_stream_readable) body.  You may then [`pipe`](http://devdocs.io/node/stream#stream_readable_pipe_destination_options) the body anywhere you like, or pass it as the `body` of a [`paperplane`](https://github.com/articulate/paperplane/blob/master/docs/getting-started.md#response-object) response, or the `Body` of an AWS [`upload`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property) request.

```js
const aws   = require('aws-sdk')
const gimme = require('@articulate/gimme')
const { promisify } = require('@articulate/funky')

const s3     = new aws.S3()
const upload = promisify(s3.upload, s3)

const uploadToS3 = res =>
  upload({
    ACL: 'public-read',
    Body: res.body,
    Bucket: 'my-bucket',
    ContentType: res.headers['content-type'],
    Key: '200-response'
  })

gimme({ json: false, stream: true, url: 'http://httpstat.us/200' })
  .then(uploadToS3)
```
