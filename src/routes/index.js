// Routes definition

import chunks from './chunks' // Client or server

const ignoreRoutes = [
  'index',
  '404'
]

const routes = [
  { path: '/', component: chunks['index'] },

  ...Object.keys(chunks)
    .filter(route => ignoreRoutes.indexOf(route.split('/')[0]) < 0)
    .map(route => ({
      path: `/${route}`,
      component: chunks[route]
    })),

  { component: chunks['404'] },
]

export default routes
