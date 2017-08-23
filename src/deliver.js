'use strict'

const path = require('path')
const niceTry = require('nice-try')
const junk = require('junk')
const browserSync = niceTry(() => require('browser-sync'))
const cache = require('./cache')

/**
 * Get a list of files to watch.
 * @returns {Array} files
 */
const getFiles = function() {

	// Exclude the following files
	const excludedFiles = [
		'!**/CVS',
		'!**/.git',
		'!**/.svn',
		'!**/.hg',
		'!**/.lock-wscript',
		'!**/.wafpickle-N',
		'!**/node_modules',
		'!**/bower_components'
	]

	// Include the following files
	const includedFiles = [
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
 * @param {Object} bs - Browsersync instance.
 * @param {String} event - Event sent by Chokidar.
 * @param {String} filePath - File affected by event (relative).
 */
const eventHandler = function(bs, event, filePath) {

	const fileName = path.parse(filePath).base
	const fileExtension = path.extname(filePath)

	// Ignore change when filePath is junk
	if (junk.is(fileName)===true) return

	// Flush the cache no matter what event was send by Chokidar.
	// This ensures that we serve the latest files when the user reloads the site.
	cache.flush(filePath)

	const styleExtensions = [
		'.css',
		'.scss',
		'.sass',
		'.less'
	]

	// Reload stylesheets when the file extension is a known style extension
	if (styleExtensions.includes(fileExtension)===true) return bs.reload('*.css')

	const imageExtensions = [
		'.png',
		'.jpg',
		'.jpeg',
		'.svg',
		'.gif',
		'.webp'
	]

	// Reload images when the file extension is a known image extension supported by Browsersync
	if (imageExtensions.includes(fileExtension)===true) return bs.reload(`*${ fileExtension }`)

	bs.reload()

}

/**
 * Serve a directory and reload the page when files change.
 * @public
 * @param {String} srcPath - Path to the source folder.
 * @param {Function} rewrite - URL rewrite middleware.
 * @param {Function} redirect - URL redirect middleware.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(srcPath, rewrite, redirect, opts, next) {

	if (browserSync==null) {
		return next(new Error('Rosid has been installed without optionalDependencies. Make sure that all optionalDependencies are installed before serving a site.'))
	}

	const bs = browserSync.create()

	const server = {
		baseDir: srcPath,
		middleware: [
			rewrite,
			redirect
		]
	}

	const files = {
		match: getFiles(),
		fn: eventHandler.bind(null, bs),
		options: {
			ignoreInitial: true
		}
	}

	const snippetOptions = {
		blacklist: opts.static
	}

	const defaults = {
		logPrefix: 'Rosid',
		server: server,
		files: [ files ],
		notify: false,
		ghostMode: false,
		open: opts.open,
		startPath: opts.path,
		snippetOptions: snippetOptions
	}

	bs.init(defaults, next)

}