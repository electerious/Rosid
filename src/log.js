'use strict'

const tfunk  = require('tfunk')
const prefix = tfunk('[{blue:Rosid}]')

/**
 * Log a message similar to browser-sync.
 * @public
 * @param {String} msg - Message which should be logged to the console.
 */
module.exports = function(msg) {

	msg = tfunk(msg)

	console.log(`${ prefix } ${ msg }`)

}