export default (answer) => {
  const noSynonyms = ['NO', 'NOPE']
  const ans = answer.toUpperCase()
  return noSynonyms.includes(ans)
}
