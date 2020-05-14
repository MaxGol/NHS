export default (answer) => {
  const yesSynonyms = ['YEAH', 'YEP', 'YESH', 'YAH', 'YUP', 'YA', 'YES', 'Y']
  const ans = answer.toUpperCase()
  return yesSynonyms.includes(ans)
}
