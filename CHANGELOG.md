# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Removed `prepublish` script from `package.json`

## [9.0.2] - 2018-01-07

### Fixed

- Assert parameter order in tests

## [9.0.1] - 2017-08-08

### Changed

- Ignore `yarn.lock` and `package-lock.json` files

## [9.0.0] - 2017-07-31

### New

- Added `static` option to disable browser reload for specific files
- CLI examples
- Helpful error when `rosidfile.js` or `rosidfile.json` is missing

### Changed

- Switched to a smaller package for parse CLI flags and arguments

### Removed

- Removed `polling` option

## [8.0.0] - 2017-07-19

### New

- Documentation for patterns
- Reload browser when a file has been added or removed
- Inject images when an image changes instead of reloading the browser

### Changed

- Cache array of handlers must contain glob patterns
- Reduced number of cache calls
- Removed `async` or replaced it with a smaller module