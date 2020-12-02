
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./persist.cjs.production.min.js')
} else {
  module.exports = require('./persist.cjs.development.js')
}
