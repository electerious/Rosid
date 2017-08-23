'use strict'

const os = require('os')
const fs = require('fs')
const pify = require('pify')
const assert = require('chai').assert
const uuid = require('uuid/v4')
const save = require('./../src/save')

const fsify = require('fsify')({
	cwd: os.tmpdir()
})

describe('save()', function() {

	it('should save a file', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: uuid()
			}
		]

		return fsify(structure).then((structure) => {

			const filePath = structure[0].name
			const data = uuid()

			return pify(save)(filePath, data, {}).then(() => {

				assert.strictEqual(fs.readFileSync(filePath, 'utf8'), data)

			})

		})

	})

	it('should save a file with verbose enabled', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: uuid()
			}
		]

		return fsify(structure).then((structure) => {

			const filePath = structure[0].name
			const data = uuid()

			return pify(save)(filePath, data, { verbose: true }).then(() => {

				assert.strictEqual(fs.readFileSync(filePath, 'utf8'), data)

			})

		})

	})

})