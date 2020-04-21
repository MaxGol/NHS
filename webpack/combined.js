const config = require('./config')

module.exports = ['leaderboard', 'cms'].map((path, i) => config(path, i))
