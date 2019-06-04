# Asterisk pattern matching

Simple package with no dependecies for validation phone numbers according to given [asterisk pattern](https://wiki.asterisk.org/wiki/display/AST/Pattern+Matching).
## Install with

    npm install asterisk-pattern-matching

## Usage Example
```js
// function to verify the asterisk pattern truth
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

```js
// function to verify the asterisk pattern truth and parse number by given settings
const { parseNumber } = require("asterisk-pattern-matching")

// list of examples, function ends at first pattern match
const myPatterns = [
    // {
    //     pattern:,   // (String) asterisk pattern
    //     deleteFromStart:, // (String|Number) indicates, how many chars should be removed from number's START
    //     deleteFromEnd:,   // (String|Number)indicates, how many chars should be removed from number's END  
    //     prefix:,    // (String|Number) indicates, what should be added to number's START
    //     suffix:     // (String|Number) indicates, what should be added to number's END  
    // },
    {
        pattern: '_77X.',
        deleteFromStart: 1,
        deleteFromEnd: 1,
        prefix: '***',  
        suffix: '###'
    },
    {
        pattern: '_[*+#0-9].',
        deleteFromStart: '2',
        deleteFromEnd: '1',
        prefix: 123,
        suffix: 321
    },
    {
        pattern: '_+X.',
        deleteFromStart: 4,  
        deleteFromEnd: 3,  
        prefix: '0',  
        suffix: '123'
    }
]

// [] = removed, () = added
// second pattern (_[*+#0-9].) from variable myPatterns is valid,  
// (123)[+4]20999888-7[7](321) => result 12320999888-7321
// function stops after first valid pattern
parseNumber('*420999888-77', myPatterns)


// last pattern (_+X) from variable myPatterns is valid, 
// (9)[+420]999888[-77](123) => result 0999888123
parseNumber('+420999888-77', myPatterns)
```