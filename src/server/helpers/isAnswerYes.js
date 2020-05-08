export default (answer) => {
  const yesSynonyms = ['YEAH', 'YEP', 'YESH', 'YAH', 'YA', 'YES']
  const ans = answer.toUpperCase()
  return yesSynonyms.includes(ans)
}
