'use strict'

const async = require('async')
const path  = require('path')
const mm    = require('micromatch')
const fse   = require('fs-extra')
const klaw  = require('klaw')
const log   = require('./log')

/**
 * Run multiple route functions parallel.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {String} srcPath - Path to the source folder.
 * @param {String} distPath - Path to the destination folder.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, opts, next) {

	const getHandlerFn = (filePath) => {

		// Set file path relative to the src path as route paths are relative, too
		const fileRoute = path.relative(srcPath, filePath)

		// Generate an array of matching routes and use the first matching route only
		const matches = routes.filter((route) => mm.isMatch(fileRoute, route.path))
		const route   = matches[0]

		// Return empty fn when no matching route found
		if (route==null) return (next) => next()

		// Return fn when matching route found
		return (next) => {

			log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ fileRoute }`)

			const processHandler = ({ data, savePath }) => {

				log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ fileRoute }`)

				if (data==null) {
					return next(new Error(`Handler of route '${ route.name }' returned without data`))
				}

				if (savePath==null || savePath==='') {
					return next(new Error(`File of route '${ route.name }' could not be saved as no path has been specified by the handler`))
				}

				if (opts.verbose===true) log(`{cyan:Saving file: {grey:${ savePath }`)

				fse.outputFile(savePath, data, (err) => {

					if (err!=null) return next(err)

					if (opts.verbose===true) log(`{cyan:Saved file: {grey:${ savePath }`)

					next()

				})

			}

			route
				.handler(filePath, srcPath, distPath, route)
				.then(processHandler, next)

		}

	}

	// Array of fns to execute
	const query = []

	klaw(srcPath).on('data', (file) => {

		const filePath = file.path

		// Store handler fn in query
		query.push(getHandlerFn(filePath))

	}).on('end', () => {

		// Run each fn and continue with next
		async.parallel(query, next)

	})

}