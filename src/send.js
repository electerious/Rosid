'use strict'

/**
 * Sends a chunk of the response body and signals the server
 * that all of the response headers and body have been sent.
 * @param {Object} res - Object which was created internally by a HTTP server.
 * @param {String} contentType - MIME-Type of the data.
 * @param {String|Buffer} data
 */
module.exports = function(res, contentType, data) {

	res.setHeader('Content-Type', contentType)
	res.end(data)

}