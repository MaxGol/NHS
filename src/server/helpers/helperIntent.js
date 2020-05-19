export default (answer) => {
  const frazes = ['ABOUT', 'WHAT IS THIS?', 'TELL ME ABOUT THIS', 'MORE INFO']
  const ans = answer.toUpperCase()
  return frazes.includes(ans)
}
