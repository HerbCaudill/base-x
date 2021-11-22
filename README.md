# base-x

Fast base encoding / decoding of any given alphabet using bitcoin style leading zero compression.

**WARNING:** This module is **NOT RFC3548** compliant, it cannot be used for base16 (hex), base32, or base64 encoding in a standards compliant manner.

## Example

Base58

```javascript
import { basex } from 'base-x'
var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var bs58 = basex(BASE58)

var decoded = bs58.decode('5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr')

console.log(decoded)
// => <Buffer 80 ed db dc 11 68 f1 da ea db d3 e4 4c 1e 3f 8f 5a 28 4c 20 29 f7 8a d2 6a f9 85 83 a4 99 de 5b 19>

console.log(bs58.encode(decoded))
// => 5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr
```

### Alphabets

See below for a list of commonly recognized alphabets, and their respective base.

| base | alphabet                                                              | export    |
| ---- | --------------------------------------------------------------------- | --------- |
| 2    | `01`                                                                  | `base2`   |
| 8    | `01234567`                                                            | `base8`   |
| 11   | `0123456789a`                                                         | `base11`  |
| 16   | `0123456789abcdef`                                                    | `base16`  |
| 32   | `0123456789ABCDEFGHJKMNPQRSTVWXYZ`                                    | `base32`  |
| 32   | `ybndrfg8ejkmcpqxot1uwisza345h769` (z-base-32)                        | `basez32` |
| 36   | `0123456789abcdefghijklmnopqrstuvwxyz`                                | `base36`  |
| 58   | `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`          | `base58`  |
| 62   | `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`      | `base62`  |
| 64   | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`    | `base64`  |
| 67   | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~` | `base67`  |

For convenience, these are exported with the names shown above. For example, the above code could be written as follows:

```javascript
import { bs58 } from 'base-x'

var decoded = bs58.decode('5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr')

console.log(decoded)
// => <Buffer 80 ed db dc 11 68 f1 da ea db d3 e4 4c 1e 3f 8f 5a 28 4c 20 29 f7 8a d2 6a f9 85 83 a4 99 de 5b 19>

console.log(bs58.encode(decoded))
// => 5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr
```

## LICENSE [MIT](LICENSE)

Adapted from https://github.com/cryptocoinjs/base-x
