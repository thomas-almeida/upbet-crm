function generateExtensiveId(items) {

  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  let itemId = ''

  do {
    for (let i = 0; i < 6; i++) {
      const randomLetter = Math.floor(Math.random() * letters.length)
      itemId += letters[randomLetter]
    }

    for (let i = 0; i < 3; i++) {
      const randomNumber = Math.floor(Math.random() * numbers.length)
      itemId += numbers[randomNumber]
    }
  } while (items.some(item => item.id === itemId))

  return itemId

}

export default {
  generateExtensiveId
}