export default (answer) => {
  const yesSynonyms = [
    'YEAH',
    'YEP',
    'YESH',
    'YAH',
    'YUP',
    'YA',
    'YES',
    'Y',
    'YES!'
  ]
  const ans = answer.toUpperCase()
  return yesSynonyms.includes(ans)
}
