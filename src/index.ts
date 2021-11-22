export const basex = (alphabet: string): BaseConverter => {
  if (alphabet.length >= 255) throw new TypeError('Alphabet can only have 255 characters or less')

  const baseMap = new Uint8Array(256)
  for (let j = 0; j < baseMap.length; j++) baseMap[j] = 255

  for (let i = 0; i < alphabet.length; i++) {
    const x = alphabet.charAt(i)
    const xc = x.charCodeAt(0)

    if (baseMap[xc] !== 255) throw new TypeError(x + ' is ambiguous')
    baseMap[xc] = i
  }

  const base = alphabet.length
  const leader = alphabet.charAt(0)
  const factor = Math.log(base) / Math.log(256) // rounded up
  const iFactor = Math.log(256) / Math.log(base) // rounded up

  function encode(source: Buffer | number[] | Uint8Array): string {
    if (Array.isArray(source) || source instanceof Uint8Array) source = Buffer.from(source)
    if (!Buffer.isBuffer(source)) throw new TypeError('Expected Buffer')
    if (source.length === 0) return ''

    // Skip & count leading zeroes.
    let zeroes = 0
    let length = 0
    let pbegin = 0
    const pend = source.length

    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }

    // Allocate enough space in big-endian encoded representation.
    const size = ((pend - pbegin) * iFactor + 1) >>> 0
    const encoded = new Uint8Array(size)

    // Process the bytes.
    while (pbegin !== pend) {
      let carry = source[pbegin]

      // Apply "encoded = encoded * 256 + ch".
      let i = 0
      for (let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
        carry += (256 * encoded[it1]) >>> 0
        encoded[it1] = carry % base >>> 0
        carry = (carry / base) >>> 0
      }

      if (carry !== 0) throw new Error('Non-zero carry')
      length = i
      pbegin++
    }

    // Skip leading zeroes in encoded result.
    let it2 = size - length
    while (it2 !== size && encoded[it2] === 0) it2++

    // Translate the result into a string.
    let str = leader.repeat(zeroes)
    for (; it2 < size; ++it2) str += alphabet.charAt(encoded[it2])

    return str
  }

  function decodeUnsafe(source: string): Buffer | undefined {
    if (typeof source !== 'string') throw new TypeError('Expected String')
    if (source.length === 0) return Buffer.alloc(0)

    let psz = 0

    // Skip and count leading '1's.
    let zeroes = 0
    let length = 0
    while (source[psz] === leader) {
      zeroes++
      psz++
    }

    // Allocate enough space in big-endian base256 representation.
    const size = ((source.length - psz) * factor + 1) >>> 0 // log(58) / log(256), rounded up.
    const encoded = new Uint8Array(size)

    // Process the characters.
    while (source[psz]) {
      // Decode character
      let carry = baseMap[source.charCodeAt(psz)]

      // Invalid character
      if (carry === 255) return

      let i = 0
      for (let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
        carry += (base * encoded[it3]) >>> 0
        encoded[it3] = carry % 256 >>> 0
        carry = (carry / 256) >>> 0
      }

      if (carry !== 0) throw new Error('Non-zero carry')
      length = i
      psz++
    }

    // Skip leading zeroes in b256.
    let it4 = size - length
    while (it4 !== size && encoded[it4] === 0) it4++

    const decoded = Buffer.allocUnsafe(zeroes + (size - it4))
    decoded.fill(0x00, 0, zeroes)

    let j = zeroes
    while (it4 !== size) decoded[j++] = encoded[it4++]

    return decoded
  }

  function decode(string: string): Buffer {
    const buffer = decodeUnsafe(string)
    if (buffer) return buffer

    throw new Error('Non-base' + base + ' character')
  }

  return { encode, decodeUnsafe, decode }
}

export const base2 = basex(`01`)
export const base8 = basex(`01234567`)
export const base11 = basex(`0123456789a`)
export const base16 = basex(`0123456789abcdef`)
export const base32 = basex(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`)
export const basez32 = basex(`ybndrfg8ejkmcpqxot1uwisza345h769`)
export const base36 = basex(`0123456789abcdefghijklmnopqrstuvwxyz`)
export const base58 = basex(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`)
export const base62 = basex(`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`)
export const base64 = basex(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`)
export const base67 = basex(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~`)

export interface BaseConverter {
  encode(buffer: Buffer | number[] | Uint8Array): string
  decodeUnsafe(string: string): Buffer | undefined
  decode(string: string): Buffer
}
