'use strict'

const assert  = require('chai').assert
const temp    = require('temp').track()
const deliver = require('./../src/deliver')

describe('deliver()', function() {

	it('should deliver a directory', function(next) {

		const srcPath  = temp.mkdirSync()
		const rewrite  = () => {}
		const redirect = () => {}
		const opts     = { open: false }

		deliver(srcPath, rewrite, redirect, opts, next)

	})

})