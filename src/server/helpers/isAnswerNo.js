export default (answer) => {
  const noSynonyms = [
    'NO',
    'NOPE',
    'NAH',
    'NA',
    'N',
    'NO!'
  ]
  const ans = answer.toUpperCase()
  return noSynonyms.includes(ans)
}
