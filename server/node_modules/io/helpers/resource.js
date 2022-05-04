const https = require('https');
const http = require('http');

class APIResourceRequest {

  constructor (parent, path) {

    this.parent = parent;
    this.path = path[0] === '/' ? path : `/${path}`;
    this._headers = {};

  }

  headers (obj) {
    this._headers = obj;
    return this;
  }

  /* CRUD Methods */

  async index (params) {
    return await this.get(null, params);
  }

  async show (id, params) {
    return await this.get(id, params);
  }

  async destroy (id, params) {
    return await this.del(id, params);
  }

  async update (id, params, data) {
    return await this.put(id, params, data);
  }

  async create (params, data) {
    return await this.post(null, params, data);
  }

  /* HTTP methods */

  async put (id, params, data) {
    return await this.requestJSON('PUT', id, params, data);
  }

  async post (id, params, data) {
    return await this.requestJSON('POST', id, params, data);
  }

  async del (id, params) {
    return await this.requestJSON('DELETE', id, params, null);
  }

  async get (id, params) {
    return await this.requestJSON('GET', id, params, null);
  }

  /* Request methods */

  async requestJSON (method, id, params, data) {
    return await this.__request__(true, method, id, params, data);
  }

  async request (method, id, params, data) {
    return await this.__request__(false, method, id, params, data);
  }

  async stream (method, data, onMessage) {

    let headers = this.__formatHeaders__();
    let url = this.path;

    let res = await this.__send__(method, url, headers, data);
    let buffers = [];
    res.on('data', chunk => {
      buffers.push(chunk);
      onMessage(chunk);
    });

    return new Promise((resolve, reject) => {
      res.on('end', () => resolve(Buffer.concat(buffers)));
    });

  }

  __formatHeaders__ () {

    let headers = {};

    Object.keys(this.parent._headers).forEach(k => headers[k] = this.parent._headers[k]);
    Object.keys(this._headers).forEach(k => headers[k] = this._headers[k]);

    return headers;

  }

  async __request__ (expectJSON, method, id, params, data) {

    params = this.parent.serialize(params, true);

    let path = this.path;
    let headers = this.__formatHeaders__();

    if (data && typeof data === 'object' && !(data instanceof Buffer)) {
      try {
        if (data.hasOwnProperty('__serialize__')) {
          delete data.__serialize__;
          data = this.parent.serialize(data);
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
          data = JSON.stringify(data);
          headers['Content-Type'] = 'application/json; charset=utf-8';
        }
      } catch (e) {
        // do nothing
      }
    }

    let url = `${path}${id ? '/' + id : ''}`;
    if (url.includes('?')) {
      url = url.endsWith('?') ? `${url}${params}` : `${url}&${params}`;
    } else {
      url = `${url}?${params}`;
    }

    let res = await this.__send__(method, url, headers, data);
    let buffers = [];
    res.on('data', chunk => buffers.push(chunk))

    return new Promise((resolve, reject) => {
      res.on('end', () => {

        let body = Buffer.concat(buffers);
        let json = null;

        if (expectJSON || (res.headers['content-type'] || '').split(';')[0] === 'application/json') {
          let str = body.toString();
          try {
            json = JSON.parse(str);
          } catch (e) {
            return reject(new Error(['Expecting JSON, invalid response:', str].join('\n')));
          }
        }

        return resolve({
          json: json,
          body: body,
          headers: res.headers,
          statusCode: res.statusCode
        });

      });
    });

  }

  async __send__(method, url, headers, data) {

    return new Promise((resolve, reject) => {
      (this.parent.ssl ? https : http).request(
        {
          headers: headers,
          host: this.parent.host,
          method: method,
          port: this.parent.port,
          path: url
        },
        res => resolve(res)
      )
      .on('error', (err) => reject(new Error(`Server unavailable: ${method} ${this.parent.host}:${this.parent.port}${url}`)))
      .end(
        method === 'POST' || method === 'PUT' || method === 'PATCH'
        ? data || null
        : null
      );
    });

  }

}

class APIResource {

  constructor (host, port, ssl) {

    host = host || '';

    if (host.indexOf('https://') === 0) {
      host = host.substr(8);
      port = parseInt(port) || 443;
      ssl = true;
    } else if (host.indexOf('http://') === 0) {
      host = host.substr(7);
      port = parseInt(port) || 80;
      ssl = false;
    } else {
      port = parseInt(port) || 443;
      ssl = false;
    }

    if (port === 443) {
      ssl = true;
    }

    if (host.split(':').length > 1) {
      let split = host.split(':');
      host = split[0];
      port = parseInt(split[1]);
    }

    this.host = host;
    this.port = port;
    this.ssl = ssl;
    this._headers = {};

  }

  authorize (accessToken) {
    if (accessToken.startsWith('Bearer ') || accessToken.startsWith('Basic ')) {
      this._headers.Authorization = accessToken;
    } else {
      this._headers.Authorization = `Bearer ${accessToken}`;
    }
    return this;
  }

  __convert__ (keys, isArray, v) {
    isArray = ['', '[]'][isArray | 0];
    return (keys.length < 2) ? (
      [keys[0], isArray, '=', v].join('')
    ) : (
      [keys[0], '[' + keys.slice(1).join(']['), ']', isArray, '=', v].join('')
    );
  }

  __serialize__ (obj, keys, key, i) {

    keys = keys.concat([key]);
    let datum = obj;

    keys.forEach(key => datum = datum[key]);

    if (datum instanceof Date) {

      datum = [datum.getFullYear(), datum.getMonth() + 1, datum.getDate()].join('-');

    }

    if (datum instanceof Array) {

      return datum.map(fnConvert.bind(null, keys, true)).join('&');

    } else if (typeof datum === 'object' && datum !== null) {

      return Object.keys(datum).map(this.__serialize__.bind(null, obj, keys)).join('&');

    }

    return this.__convert__(keys, false, datum);

  }

  serialize (obj, URIEncoded) {

    obj = obj || {};

    let newObj = {};
    Object.keys(obj).forEach(k => newObj[k] = URIEncoded ? encodeURIComponent(obj[k]) : obj[k]);

    return Object.keys(newObj).map(this.__serialize__.bind(this, newObj, [])).join('&');

  }

  request (path) {

    return new APIResourceRequest(this, path);

  }

}

module.exports = APIResource;
