'use strict'

let tfunk  = require('tfunk'),
    prefix = tfunk('[{blue:Rosid}]')

/**
 * Log a message similar to browser-sync.
 * @public
 * @param {string} msg - Message which should be logged to in the console.
 */
module.exports = function(msg /*= ''*/) {

	msg = tfunk(msg)

	console.log(`${ prefix } ${ msg }`)

}