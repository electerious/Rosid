'use strict'

const util = require('util')
const os = require('os')
const assert = require('chai').assert
const uuid = require('uuid/v4')
const deliver = require('./../src/deliver')

const fsify = require('fsify')({
	cwd: os.tmpdir()
})

describe('deliver()', function() {

	it('should return a Browsersync instance', function() {

		const structure = [
			{
				type: fsify.DIRECTORY,
				name: uuid()
			}
		]

		return fsify(structure).then((structure) => {

			const srcPath = structure[0].name
			const rewrite = () => {}
			const redirect = () => {}
			const opts = { open: false }

			return util.promisify(deliver)(srcPath, rewrite, redirect, opts)

		}).then((bs) => {

			assert.isObject(bs)

		})

	})

})