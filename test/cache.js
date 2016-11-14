'use strict'

const assert = require('chai').assert
const cache  = require('./../src/cache')

describe('cache', function() {

	describe('.set()', function() {

		it('should add an item', function() {

			cache.set('file.html', { cache: [ 'html' ] })

			assert.isDefined(cache.get('file.html'))

		})

	})

	describe('.get()', function() {

		it('should return an item', function() {

			const key   = 'file.html'
			const value = { cache: [ 'html' ] }

			cache.set(key, value)

			assert.deepEqual(cache.get(key), value)

		})

		it('should return undefined for unknown items', function() {

			assert.isUndefined(cache.get('file.js'))

		})

	})

	describe('.flush()', function() {

		it('should clear items with the given extension', function() {

			cache.set('file.html', { cache: [ 'html' ] })
			cache.set('file.css', { cache: [ 'css' ] })

			cache.flush('html')

			assert.isUndefined(cache.get('file.html'))
			assert.isDefined(cache.get('file.css'))

		})

		it('should not clear items with the given extension when extension not matching', function() {

			cache.set('file.html', { cache: [ 'html' ] })
			cache.set('file.css', { cache: [ 'css' ] })

			cache.flush('js')

			assert.isDefined(cache.get('file.html'))
			assert.isDefined(cache.get('file.css'))

		})

		it('should clear all items without a cache property', function() {

			cache.set('file.html', {})

			cache.flush()

			assert.isUndefined(cache.get('file.html'))

		})

	})

})