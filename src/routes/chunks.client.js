// Generated - Client-side routes

import load from './loadAsync'

export default {
  '404': load(() => import(/* webpackChunkName: "404" */ '../pages/404.js')),
  'index': load(() => import(/* webpackChunkName: "index" */ '../pages/index.js')),
  'test': load(() => import(/* webpackChunkName: "test" */ '../pages/test/index.js'))
}
