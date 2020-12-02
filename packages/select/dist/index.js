
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./select.cjs.production.min.js')
} else {
  module.exports = require('./select.cjs.development.js')
}
