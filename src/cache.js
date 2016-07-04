'use strict'

const cache = new Map()

/**
 * Gets an object from the cache.
 * @public
 * @param {String} key - Identifier of the cached object.
 * @returns {?Object} obj - Cached object.
 */
const _get = function(key) {

	return cache.get(key)

}

/**
 * Saves an object in the cache.
 * @public
 * @param {String} key - Identifier for the cached object.
 * @param {Object} obj - Object which should be cached.
 */
const _set = function(key, obj) {

	obj = Object.assign({}, obj)

	cache.set(key, obj)

}

/**
 * Deletes matching data when an extension is given or all data when no extension is given.
 * @public
 * @param {String} extension - Related extension which should be deleted.
 */
const _flush = function(extension) {

	cache.forEach((value, key) => {

		// Delete entry directly when no caching information available
		if (value.cache==null) return cache.delete(key)

		// Look for matching extensions in the current entry
		const matches = value.cache.filter((value) => value===extension)

		// Delete entry when a match was found
		if (matches.length>0) cache.delete(key)

	})

}

/**
 * @public
 */
module.exports = {
	get   : _get,
	set   : _set,
	flush : _flush
}