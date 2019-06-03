const validateNumber = (asteriskPattern, number) => {
  if (!asteriskPattern) throw new Error('AsteriskPattern is missing')
  if (!number) throw new Error('Number for validation is missing')
  if (typeof number === 'number') number = number.toString()
  const asteriskPatternWithoutBrackets = asteriskPattern.replace(/\[.*?\]/, '@')
  let patterns = []
  const lettersRegex = /[xXnNzZ]/g
  const numbersRegex = /[0-9]/g
  const bracketsRegex = /\[.*?\]/g
  const charactersRegex = /[*#+]/g
  const asteriskXZNPattern = {
    X: '[0-9]',
    Z: '[1-9]',
    N: '[2-9]'
  }

  // find reserved letters x,X,n,N,z,Z
  let lettersMatch
  do {
    lettersMatch = lettersRegex.exec(asteriskPatternWithoutBrackets)
    if (lettersMatch) {
      patterns.push({
        pattern: lettersMatch[0],
        index: lettersMatch.index - 1,
        validate: (number, i, pattern) => !!number.match(new RegExp(`^.{${i}}${asteriskXZNPattern[pattern]}`))
      })
    }
  } while (lettersMatch)

  // find numbers
  let numbersMatch
  do {
    numbersMatch = numbersRegex.exec(asteriskPatternWithoutBrackets)
    if (numbersMatch) {
      patterns.push({
        pattern: numbersMatch[0],
        index: numbersMatch.index - 1,
        validate: (number, i, pattern) => parseInt(number[i]) === parseInt(pattern)
      })
    }
  } while (numbersMatch)

  // find patterns in [] (allowed for example [1-4],[1-25],[a-g],[.],[!])
  let rangesMatch
  do {
    rangesMatch = bracketsRegex.exec(asteriskPattern)
    if (rangesMatch) {
      patterns.push({
        pattern: rangesMatch[0],
        index: rangesMatch.index - 1,
        validate: (number, i, pattern) => !!number.match(new RegExp(`^.{${i}}${pattern}`))
      })
    }
  } while (rangesMatch)

  // find special characters (allowed *,#,+)
  let charactersMatch
  do {
    charactersMatch = charactersRegex.exec(asteriskPatternWithoutBrackets)
    if (charactersMatch) {
      patterns.push({
        pattern: charactersMatch[0],
        index: charactersMatch.index - 1,
        validate: (number, i, pattern) => number[i] === pattern
      })
    }
  } while (charactersMatch)

  // find '.' at end of pattern
  const dotsMatch = asteriskPatternWithoutBrackets.lastIndexOf('.')
  if (dotsMatch > 0 && (dotsMatch === asteriskPatternWithoutBrackets.length - 1)) {
    patterns.push({
      pattern: '.',
      index: dotsMatch - 1,
      validate: (number, i, pattern) => number.length >= dotsMatch
    })
  }

  // find '!' at end of pattern
  const exclamationMatch = asteriskPatternWithoutBrackets.lastIndexOf('!')
  if (exclamationMatch > 0 && (exclamationMatch === asteriskPatternWithoutBrackets.length - 1)) {
    patterns.push({
      pattern: '!',
      index: exclamationMatch - 1,
      validate: (number, i, pattern) => number.length >= (exclamationMatch - 1)
    })
  }

  // if there are no . or !, number length must be equal to pattern length
  if (dotsMatch < 0 && exclamationMatch < 0) {
    patterns.push({
      pattern: asteriskPatternWithoutBrackets.length - 1,
      index: 0,
      validate: (number, i, pattern) => number.length === asteriskPatternWithoutBrackets.length - 1
    })
  }
  // validate all number's positions, break at first unsatisfactory number
  return patterns.sort((a, b) => a.index - b.index).every(({ pattern, index, validate }) => validate(number, index, pattern))
}

exports.validateNumber = validateNumber

const modifyNumber = (number, { deleteFromStart = 0, deleteFromEnd = 0, prefix, suffix }) => {
  return `${prefix}${number.substring(parseInt(deleteFromStart), number.length - deleteFromEnd)}${suffix}`
}

exports.parseNumber = (number, patternInfo) => {
  try {
    if (!number) throw new Error('Number for validation is missing')
    if (!patternInfo) throw new Error('Information about asterisk pattern and number modification are missing')
    if (!Array.isArray(patternInfo)) patternInfo = [patternInfo]
    patternInfo.some(({ pattern, ...modifications }) => {
      const matchRule = validateNumber(pattern, number)
      if (matchRule) number = modifyNumber(number, { ...modifications })
      return matchRule
    })
    return number
  } catch (err) {
    throw err
  }
}
