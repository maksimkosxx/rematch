
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./updated.cjs.production.min.js')
} else {
  module.exports = require('./updated.cjs.development.js')
}
