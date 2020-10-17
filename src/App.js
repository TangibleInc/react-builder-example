import { useEffect, useMemo } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useStore } from 'medux/react'
import { connectReduxDevTools } from 'medux/redux-devtools'

import routes from './routes'
import renderRoutes from './utils/renderRoutes'

const meta = {
  defaultTitle: 'Static starter',
  titleTemplate: '%s | Static starter',
  htmlAttributes: { lang: 'en' },
  meta: [
    { name: 'description', content: '' }
  ],
  link: [
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
  ]
}

const App = ({
  store,
  location, // { pathname, search, hash }
}) => {

  useStore({ store })

  useEffect(() => {
    connectReduxDevTools(store)
    window.app = store
  }, [])

  return <>
    <Helmet {...meta} />
    <header>

    </header>
    <main>
      { renderRoutes(routes, store) }
    </main>
  </>
}

export default withRouter(App)