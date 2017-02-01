'use strict'

const fse = require('fs-extra')
const log = require('./log')

/**
 * Saves a file to disk.
 * @public
 * @param {String} filePath - Absolute path where the file should be saved to.
 * @param {String|Buffer} data - Content of file.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(filePath, data, next) {

	if (opts.verbose===true) log(`{cyan:Saving file: {grey:${ fileSave }`)

	fse.outputFile(fileSave, data, (err) => {

		if (err!=null) return next(err)

		if (opts.verbose===true) log(`{cyan:Saved file: {grey:${ fileSave }`)

		next()

	})

}