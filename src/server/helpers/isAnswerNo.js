export default (answer) => {
  const noSynonyms = ['NO', 'NOPE', 'NAH', 'NA', 'N']
  const ans = answer.toUpperCase()
  return noSynonyms.includes(ans)
}
