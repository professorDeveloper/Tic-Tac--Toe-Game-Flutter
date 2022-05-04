# io

**io** is a simple Node.js HTTP wrapper for API calls.

Methods supported are...

```javascript
const io = require('io');

io.request(method, url, queryParams = {}, headers = null, body = null);
io.get(url, authorization = null, headers = null, queryParams = {});
io.del(url, authorization = null, headers = null, queryParams = {});
io.post(url, authorization = null, headers = null, params = {});
io.put(url, authorization = null, headers = null, params = {});
```

All requests return a `Promise` and can be run synchronously using `await`.

```javascript
let result = await io.request(method, url, queryParams = {}, headers = null, body = null);
```

## request

The `request` method takes a raw `body` string and sends no `content-type` by default.

It returns a result with the following schema;

```json
{
  "statusCode": 200,
  "headers": {},
  "body": ""
}
```

## get, del

The `get` and `del` methods will populate the URL querystring with `x-www-urlencoded`
values based on a `queryParams` object. They will send a
`content-type: application/json` header by default.

The `authorization` parameter will set the `authorization` HTTP header. If this
value begins with the strings `Basic ` or `Bearer `, the full value will be used.
Otherwise, `Bearer ` will be prepended. Sending `authorization = "x"`, for example,
will populate the `authorization` header with a value of `Bearer x`.

**NOTE:** If the requested resource does not return JSON data, an error will be thrown.

They return a result with the following schema;

```json
{
  "statusCode": 200,
  "headers": {},
  "data": {}
}
```

## post, put

The `post` and `put` methods will populate the post body with `application/json`
values based on a `params` object. They will send a
`content-type: application/json` header by default.

The `authorization` parameter will set the `authorization` HTTP header. If this
value begins with the strings `Basic ` or `Bearer `, the full value will be used.
Otherwise, `Bearer ` will be prepended. Sending `authorization = "x"`, for example,
will populate the `authorization` header with a value of `Bearer x`.

**NOTE:** If the requested resource does not return JSON data, an error will be thrown.

They return a result with the following schema;

```json
{
  "statusCode": 200,
  "headers": {},
  "data": {}
}
```

# Thanks!

&copy; 2020 Standard Library (Polybit Inc.)
