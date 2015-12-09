'use strict'

let path = require('path'),
    bs   = require('browser-sync').create()

/**
 * Serve a directory and reload the page when files change.
 * @public
 * @param {string} srcPath - Path to the source folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(srcPath, next) {

	// @todo merge bs defaults with opts

	let server = {
		baseDir    : 'src',
		middleware : rewrite
	}

	let defaults = {
		files     : path.join(srcPath, '**/*'),
		notify    : false,
		ghostMode : false,
		server    : server,
		startPath : 'index.html'
	}

	bs.init(defaults)

	next()

}