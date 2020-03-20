'use strict'

const util = require('util')
const os = require('os')
const fs = require('fs')
const assert = require('chai').assert
const uuid = require('uuid').v4
const clean = require('./../src/clean')

const fsifyCwd = require('fsify')({
	persistent: false
})

const fsifyTmp = require('fsify')({
	cwd: os.tmpdir()
})

describe('clean()', function() {

	it('should clean a directory', function() {

		const structure = [
			{
				type: fsifyCwd.DIRECTORY,
				name: uuid()
			}
		]

		return fsifyCwd(structure).then((structure) => {

			const distPath = structure[0].name
			const cwdPath = process.cwd()

			return util.promisify(clean)(distPath, cwdPath, {}).then(() => {

				assert.throws(fs.readdirSync.bind(null, distPath))

			})

		})

	})

	it('should clean a directory with verbose enabled', function() {

		const structure = [
			{
				type: fsifyCwd.DIRECTORY,
				name: uuid()
			}
		]

		return fsifyCwd(structure).then((structure) => {

			const distPath = structure[0].name
			const cwdPath = process.cwd()

			return util.promisify(clean)(distPath, cwdPath, { verbose: true }).then(() => {

				assert.throws(fs.readdirSync.bind(null, distPath))

			})

		})

	})

	it('should not clean a directory when directory is not inside cwd', function() {

		const structure = [
			{
				type: fsifyTmp.DIRECTORY,
				name: uuid()
			}
		]

		return fsifyTmp(structure).then((structure) => {

			const distPath = structure[0].name
			const cwdPath = process.cwd()

			return util.promisify(clean)(distPath, cwdPath, {})

		}).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Specified distPath must be inside the current working directory to prevent us from deleting ourself`)

		})

	})

	it('should not clean a directory when directory is the same as cwd', function() {

		const structure = [
			{
				type: fsifyTmp.DIRECTORY,
				name: uuid()
			}
		]

		return fsifyTmp(structure).then((structure) => {

			const distPath = structure[0].name
			const cwdPath = structure[0].name

			return util.promisify(clean)(distPath, cwdPath, {})

		}).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Specified distPath must be inside the current working directory to prevent us from deleting ourself`)

		})

	})

})