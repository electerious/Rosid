'use strict'

const assert   = require('chai').assert
const redirect = require('./../src/redirect')

describe('redirect', function() {

	it('should return a function', function() {

		assert.isFunction(redirect())

	})

	describe('()', function() {

		it('should call next when requested URL is not a folder', function(done) {

			const req  = {}
			const res  = {}
			const next = () => done()

			req.url = 'http://example.com/index.html'

			res.statusCode = null
			res.setHeader  = () => {}
			res.end        = () => { throw Error('Called res.end()') }

			redirect()(req, res, next)

		})

		it('should call res.end when requested URL is a folder', function(done) {

			const req  = {}
			const res  = {}
			const next = () => { throw Error('Called next') }

			req.url = 'http://example.com/'

			res.statusCode = null
			res.setHeader  = () => {}
			res.end        = () => done()

			redirect()(req, res, next)

		})

	})

})