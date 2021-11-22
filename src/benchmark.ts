'use strict'
import crypto from 'crypto'
import benchmark from 'benchmark'

import basex from '.'
var bs58ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var bs58 = basex(bs58ALPHABET)

var fixtureIndex = 0
var resetFixtureIndex = function () {
  fixtureIndex = 0
}
var fixtures = new Array(10000)
var getNextFixture = function () {
  var fixture = fixtures[fixtureIndex++]
  if (fixtureIndex === fixtures.length) {
    fixtureIndex = 0
  }

  return fixture
}

for (var i = 0; i < fixtures.length; ++i) {
  let source = crypto.randomBytes(32)
  fixtures[i] = { source, string: bs58.encode(source) }
}

if (/fast/i.test(process.argv[2])) {
  console.log('Running in fast mode...')
  benchmark.options.minTime = 0.3
  benchmark.options.maxTime = 1
  benchmark.options.minSamples = 3
} else {
  benchmark.options.minTime = 1
}

const setup = {
  onStart: function () {
    console.log('--------------------------------------------------')
  },
  onCycle: function (event: any) {
    console.log(String(event.target))
  },
  onError: function (event: any) {
    console.error(event.target.error)
  },
  onComplete: function () {
    console.log('==================================================')
  },
}

new benchmark.Suite('bs58', setup)
  .add(
    'encode',
    function () {
      var fixture = getNextFixture()
      bs58.encode(fixture.source)
    },
    { onStart: resetFixtureIndex, onCycle: resetFixtureIndex }
  )
  .add(
    'decode',
    function () {
      var fixture = getNextFixture()
      bs58.decode(fixture.string)
    },
    { onStart: resetFixtureIndex, onCycle: resetFixtureIndex }
  )
  .run()
