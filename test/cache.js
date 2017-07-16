'use strict'

const assert = require('chai').assert
const uuid   = require('uuid/v4')
const cache  = require('./../src/cache')

describe('cache', function() {

	describe('.set()', function() {

		it('should add an item', function() {

			const key   = `src/${ uuid() }.html`
			const value = { cache: [ '**/*.html' ] }

			cache.set(key, value)

			assert.isDefined(cache.get(key))

		})

	})

	describe('.get()', function() {

		it('should return an item', function() {

			const key   = `src/${ uuid() }.html`
			const value = { cache: [ '**/*.html' ] }

			cache.set(key, value)

			assert.deepEqual(cache.get(key), value)

		})

		it('should return undefined for unknown items', function() {

			const key = `src/${ uuid() }.html`

			assert.isUndefined(cache.get(key))

		})

	})

	describe('.flush()', function() {

		it('should clear items with the given extension', function() {

			const keys = [
				`src/${ uuid() }.html`,
				`src/${ uuid() }.css`
			]

			const values = [
				{ cache: [ '**/*.html' ] },
				{ cache: [ '**/*.css' ] }
			]

			cache.set(keys[0], values[0])
			cache.set(keys[1], values[1])

			cache.flush(keys[0])

			assert.isUndefined(cache.get(keys[0]))

		})

		it('should not clear items with the given extension when extension not matching', function() {

			const keys = [
				`src/${ uuid() }.html`,
				`src/${ uuid() }.css`
			]

			const values = [
				{ cache: [ '**/*.html' ] },
				{ cache: [ '**/*.css' ] }
			]

			cache.set(keys[0], values[0])
			cache.set(keys[1], values[1])

			cache.flush(`src/${ uuid() }.js`)

			assert.isDefined(cache.get(keys[0]))
			assert.isDefined(cache.get(keys[1]))

		})

		it('should clear items without a cache property', function() {

			const key   = `src/${ uuid() }.html`
			const value = {}

			cache.set(key, value)

			cache.flush(`src/${ uuid() }.js`)

			assert.isUndefined(cache.get(key))

		})

	})

})