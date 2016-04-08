'use strict'

let path  = require('path')
let bs    = require('browser-sync').create()
let cache = require('./cache')

/**
 * Get a list of files to watch.
 * @returns {Array} files
 */
const getFiles = function() {

	// Exclude the following files
	let excludedFiles = [
		'!**/.git',
		'!**/CVS',
		'!**/.svn',
		'!**/.hg',
		'!**/.lock-wscript',
		'!**/.wafpickle-N',
		'!**/*.swp',
		'!**/.DS_Store',
		'!**/._*',
		'!**/npm-debug.log',
		'!**/node_modules',
		'!**/bower_components'
	]

	// Include the following files
	let includedFiles = [
		'**/*'
	]

	// Return all ignored files
	return [
		...excludedFiles,
		...includedFiles
	]

}

/**
 * Flushes the cache and reloads the site.
 * Should be executed when a file gets updated.
 * @param {string} event
 * @param {string} file
 */
const eventHandler = function(event, file) {

	// Get the extension of the file
	let extension = path.extname(file)

	// Flush the cache no matter what event was send by Chokidar.
	// This ensures that we serve the latest files when the user reloads the site.
	cache.flush(extension)

	// Chokidar always sends an 'event' property - which could be 'add',
	// 'unlink' etc so we need to check for that and only respond to 'change'.
	if (event==='change') bs.reload()

}

/**
 * Serve a directory and reload the page when files change.
 * @public
 * @param {string} srcPath - Path to the source folder.
 * @param {function} rewrite - URL rewrite middleware.
 * @param {function} redirect - URL redirect middleware.
 * @param {Object} opts - Additional optional options.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(srcPath, rewrite, redirect, opts, next) {

	let server = {
		baseDir    : srcPath,
		middleware : [
			rewrite,
			redirect
		]
	}

	let files = {
		match   : getFiles(),
		fn      : eventHandler,
		options : {
			usePolling: opts.polling
		}
	}

	let defaults = {
		logPrefix : 'Rosid',
		server    : server,
		files     : [ files ],
		notify    : false,
		ghostMode : false
	}

	bs.init(defaults)

	next()

}