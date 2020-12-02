
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./loading.cjs.production.min.js')
} else {
  module.exports = require('./loading.cjs.development.js')
}
