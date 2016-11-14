'use strict'

const path     = require('path')
const assert   = require('chai').assert
const validate = require('./../src/validate')

describe('validate', function() {

	describe('.route()', function() {

		it('should throw when the route has no name', function() {

			const route = {
				path    : '.',
				handler : () => {},
				args    : {}
			}

			assert.throws(validate.route.bind(null, route), 'Missing name property in route')

		})

		it('should throw when the route has an empty name', function() {

			const route = {
				name    : '',
				path    : '.',
				handler : () => {},
				args    : {}
			}

			assert.throws(validate.route.bind(null, route), 'Missing name property in route')

		})

		it('should throw when the route has no path', function() {

			const route = {
				name    : 'mocha',
				handler : () => {},
				args    : {}
			}

			assert.throws(validate.route.bind(null, route), `Missing path property in route '${ route.name }'`)

		})

		it('should throw when the route has no handler', function() {

			const route = {
				name    : 'mocha',
				path    : '.',
				args    : {}
			}

			assert.throws(validate.route.bind(null, route), `Missing handler property in route '${ route.name }'`)

		})

		it('should throw when the route has a relative path', function() {

			const route = {
				name    : 'mocha',
				path    : '/a/b/c',
				handler : () => {},
				args    : {}
			}

			assert.throws(validate.route.bind(null, route), `Path in route '${ route.name }' must be relative`)

		})

		it('should throw when the route has a handler which is not a string and not a function', function() {

			const route = {
				name    : 'mocha',
				path    : '.',
				handler : [],
				args    : {}
			}

			assert.throws(validate.route.bind(null, route), `Handler in route '${ route.name }' is not a function nor a string`)

		})

		it('should return a route with a handler when handler is a string', function() {

			const route = {
				name    : 'mocha',
				path    : '.',
				handler : './index.js',
				args    : {}
			}

			assert.isFunction(validate.route(route).handler)

		})

		it('should return a route with args when args are missing', function() {

			const route = {
				name    : 'mocha',
				path    : '.',
				handler : () => {}
			}

			assert.deepEqual(validate.route(route), Object.assign(route, { args: {} }))

		})

		it('should return a route', function() {

			const route = {
				name    : 'mocha',
				path    : '.',
				handler : () => {},
				args    : {}
			}

			assert.deepEqual(validate.route(route), route)

		})

	})

	describe('.path()', function() {

		it('should return an absolute path', function() {

			const currentPath  = path.resolve('.')
			const relativePath = '.'

			assert.strictEqual(validate.path(relativePath), currentPath)

		})

	})

	describe('.opts()', function() {

		it('should set defaults when called without an object', function() {

			assert.deepEqual(validate.opts(), {
				ignore  : [],
				polling : false,
				verbose : false,
				open    : true
			})

		})

		it('should set defaults when called with an empty object', function() {

			assert.deepEqual(validate.opts({}), {
				ignore  : [],
				polling : false,
				verbose : false,
				open    : true
			})

		})

		it('should set defaults when called with an object with missing options', function() {

			const opts = {
				polling: true
			}

			assert.deepEqual(validate.opts(opts), {
				ignore  : [],
				polling : true,
				verbose : false,
				open    : true
			})

		})

		it('should return the same options when called with an object with every option specified', function() {

			const opts = {
				ignore  : [
					'array'
				],
				polling : true,
				verbose : true,
				open    : false
			}

			assert.deepEqual(validate.opts(opts), opts)

		})

	})

	describe('.next()', function() {

		it('should return an error first function when called without argument', function() {

			const fn = validate.next()

			assert.isFunction(fn)
			assert.throws(fn.bind(null, new Error('mocha')))
			assert.doesNotThrow(fn)

		})

		it('should return a function when called with a string', function() {

			assert.isFunction(validate.next('string'))

		})

		it('should return the same function when called with a function', function() {

			const fn = () => true

			assert.strictEqual(validate.next(fn)(), fn())

		})

	})

})