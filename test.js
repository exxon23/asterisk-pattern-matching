import test from 'ava'
import {validateNumber, parseNumber} from './index'

const myPatterns = [
    {
        pattern: '_77X.',
        deleteFromStart: 1,
        deleteFromEnd: 1,
        prefix: '***',  
        suffix: '###'
    },
    {
        pattern: '_[*#0-9].',
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

test(`validateNumber('_X.', 123456789) -> true`, t => {
	t.truthy(validateNumber('_X.', 123456789))
})

test(`validateNumber('_[+0-9].', 123456789) -> true`, t => {
    t.truthy(validateNumber('_[+0-9].', 123456789))
})

test(`validateNumber('_[*+#0-9].', '123456789') -> true`, t => {
    t.truthy(validateNumber('_[*+#0-9].', '123456789'))
})

test(`validateNumber('_[*+#0-9].', '+123456789') -> true`, t => {
    t.truthy(validateNumber('_[*+#0-9].', '+123456789'))
})

test(`validateNumber('_*[0-9].', '*123456789') -> true`, t => {
    t.truthy(validateNumber('_*[0-9].', '*123456789'))
})

test(`validateNumber('_*X.', '*1234*56789') -> true`, t => {
    t.truthy(validateNumber('_*X.', '*1234*56789'))
})

test(`validateNumber('_[0-9].', '123456789') -> true`, t => {
    t.truthy(validateNumber('_[0-9].', '123456789'))
})

test(`validateNumber('_XXX', '123') -> true`, t => {
    t.truthy(validateNumber('_XXX', '123'))
})

test(`validateNumber('_X.', '+123456789') -> false`, t => {
    t.falsy(validateNumber('_X.', '+123456789'))
})

test(`validateNumber('_XXX', '1234') -> false`, t => {
    t.falsy(validateNumber('_XXX', '1234'))
})

test(`parseNumber('*420999888-77', myPatterns) -> 12320999888-7321`, t => {
    t.is(parseNumber('*420999888-77', myPatterns), '12320999888-7321')
})

test(`parseNumber('+420999888-77', myPatterns) -> 0999888123`, t => {
    t.is(parseNumber('+420999888-77', myPatterns), '0999888123')
})