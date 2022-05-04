const APIResource = require('./resource.js');
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

module.exports = async (
  method,
  url,
  queryParams = null,
  authorization = null,
  headers = null,
  json = null,
  body = null
) => {

  if (ALLOWED_METHODS.indexOf(method) === -1) {
    throw new Error(`Method must be one of: ${ALLOWED_METHODS.join(', ')}`);
  }

  if (typeof url !== 'string') {
    throw new Error(`URL must be a string.`);
  }

  headers = headers || {};
  queryParams = queryParams || {};

  let httpIndex = url.indexOf('//');
  httpIndex = httpIndex === -1
    ? 0
    : httpIndex + '//'.length;
  let pathname = url.slice(httpIndex).split('/').slice(1).join('/');
  let hostname = pathname
    ? url.slice(0, url.lastIndexOf(pathname) - 1)
    : url.endsWith('/')
      ? url.slice(0, -1)
      : url;

  let resource = new APIResource(hostname);
  if (authorization) {
    resource = resource.authorize(authorization);
  }

  let request = resource.request(pathname).headers(headers);

  let result;
  if (json) {
    result = await request.requestJSON(method, null, queryParams, json);
  } else {
    result = await request.request(method, null, queryParams, Buffer.from(body || ''));
  }

  return result;

};
