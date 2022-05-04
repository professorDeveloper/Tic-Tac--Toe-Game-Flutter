const send = require('../helpers/send.js');

/**
* Perform HTTP POST request (JSON)
* @param {string} url The URL to make an HTTP(S) request to
* @param {string} authorization HTTP Authorization header value. If "Bearer " or "Basic " prefixes are not included, "Bearer " will be assumed.
* @param {object} headers Custom HTTP request headers
* @param {object} params The request JSON payload
* @returns {object} response
* @ {number} statusCode
* @ {object} headers
* @ {object} data
*/
module.exports = async (url, authorization = null, headers = null, params = {}) => {

  let result = await send('POST', url, {}, authorization, headers, params, null);
  return {
    statusCode: result.statusCode,
    headers: result.headers,
    data: result.json
  };

};
