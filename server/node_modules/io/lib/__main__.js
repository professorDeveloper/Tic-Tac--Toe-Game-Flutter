const send = require('../helpers/send.js');

/**
* Perform a fully customizable HTTP request
*  This method returns binary data (a buffer)
* @param {enum} method The request Method
*   ["GET", "GET"]
*   ["POST", "POST"]
*   ["PUT", "PUT"]
*   ["PATCH", "PATCH"]
*   ["DELETE", "DELETE"]
* @param {string} url The URL to make an HTTP(S) request to
* @param {object} queryParams Parameters sent as part of the HTTP query string
* @param {object} headers Custom HTTP request headers
* @param {string} body The raw request body for POST, PUT requests
* @returns {object} response
* @ {number} statusCode
* @ {object} headers
* @ {buffer} body
*/
module.exports = async (method, url, queryParams = {}, headers = null, body = null) => {

  let result = await send(method, url, queryParams, null, headers, null, body);
  return {
    statusCode: result.statusCode,
    headers: result.headers,
    body: result.body
  };

};
