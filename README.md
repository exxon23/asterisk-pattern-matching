# Asterisk pattern matching

Simple package with no dependecies for validation phone numbers according to given [asterisk pattern](https://wiki.asterisk.org/wiki/display/AST/Pattern+Matching).
## Install with

    npm install asterisk-pattern-matching

## Usage Example
```js
const { validateNumber } = require("asterisk-pattern-matching")

// list of examples, return true or false
validateNumber('_X.', 123456789) // true
validateNumber('_[+0-9].', 123456789) // true
validateNumber('_X.', '+123456789') // false
validateNumber('_[*+#0-9].', '123456789') // true
validateNumber('_[*+#0-9].', '+123456789') // true
validateNumber('_*[0-9].', '*123456789') // true
validateNumber('_*X.', '*1234*56789') // true
validateNumber('_[0-9].', '123456789') // true
validateNumber('_XXX', '123') // true
validateNumber('_XXX', '1234') // false
validateNumber('_+X9Z[123]N!', '+191325') // true
```