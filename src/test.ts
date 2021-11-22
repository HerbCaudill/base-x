import basex, { BaseConverter } from '../src'
import test from 'tape'
import fixtures from './fixtures.json'

type AlphabetName = keyof typeof fixtures.alphabets
const alphabetNames = Object.keys(fixtures.alphabets) as AlphabetName[]
var bases = alphabetNames.reduce(function (
  bases: Record<AlphabetName, BaseConverter>,
  alphabetName: AlphabetName
) {
  const alphabet = fixtures.alphabets[alphabetName] as string
  return {
    ...bases,
    [alphabetName]: basex(alphabet),
  }
},
{} as Record<AlphabetName, BaseConverter>)

interface ValidFixture {
  alphabet: AlphabetName
  hex: string
  string: string
  comment?: string
}
interface InvalidFixture {
  alphabet: AlphabetName
  description: string
  exception: string
  string: string
}

const valid = fixtures.valid as ValidFixture[]

valid.forEach(function (f) {
  test('can encode ' + f.alphabet + ': ' + f.hex, function (t) {
    var base = bases[f.alphabet]
    var actual = base.encode(Buffer.from(f.hex, 'hex'))

    t.plan(1)
    t.same(actual, f.string)
  })
})

valid.forEach(function (f) {
  test('can decode ' + f.alphabet + ': ' + f.string, function (t) {
    var base = bases[f.alphabet]
    var actual = base.decode(f.string).toString('hex')

    t.plan(1)
    t.same(actual, f.hex)
  })
})

const invalid = fixtures.invalid as InvalidFixture[]

invalid.forEach(function (f) {
  test('decode throws on ' + f.description, function (t) {
    var base = bases[f.alphabet]

    t.plan(1)
    t.throws(function () {
      if (!base) base = basex(f.alphabet)

      base.decode(f.string)
    }, new RegExp(f.exception))
  })
})

test('decode should return Buffer', function (t) {
  t.plan(2)
  t.true(Buffer.isBuffer(bases.base2.decode('')))
  t.true(Buffer.isBuffer(bases.base2.decode('01')))
})

test('encode throws on string', function (t) {
  var base = bases.base58

  t.plan(1)
  t.throws(function () {
    //@ts-ignorew
    base.encode('a')
  }, new RegExp('^TypeError: Expected Buffer$'))
})

test('encode not throw on Array or Uint8Array', function (t) {
  var base = bases.base58

  t.plan(2)
  t.same(base.encode([42, 12, 34]), 'F89f')
  t.same(base.encode(new Uint8Array([42, 12, 34])), 'F89f')
})
