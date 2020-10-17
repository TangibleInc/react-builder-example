// Generated - Server-side routes

import load from './load'

export default {
  '404': load('404', require('../pages/404.js')),
  'index': load('index', require('../pages/index.js')),
  'test': load('test', require('../pages/test/index.js'))
}
