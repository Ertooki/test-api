
# sleep

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Sleep for n milliseconds

## Installation

    $ npm install @f/sleep

## Usage

This is particularly useful when programming with generators, e.g.

```js
var sleep = require('@f/sleep')

function * pollThing () {
  while (!thingIsReady()) {
    yield sleep(100)
  }
}
```

## API

### sleep(timeInMs)

- `timeInMs` - The time in milliseconds you want to sleep for

**Returns:** A promise that resolves in `timeInMs` milliseconds.

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/sleep.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/sleep
[git-image]: https://img.shields.io/github/tag/micro-js/sleep.svg?style=flat-square
[git-url]: https://github.com/micro-js/sleep
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/sleep.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/sleep
