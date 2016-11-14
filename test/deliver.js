'use strict'

const assert  = require('chai').assert
const temp    = require('temp').track()
const deliver = require('./../src/deliver')

let srcPath = null

describe('deliver()', function() {

	before(function() {

		srcPath = temp.mkdirSync()

	})

	it('should deliver a directory', function(next) {

		const rewrite  = () => {}
		const redirect = () => {}
		const opts     = { open: false }

		deliver(srcPath, rewrite, redirect, opts, next)

	})

})