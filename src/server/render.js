import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { createStore } from 'medux'

export default function createRenderer({
  App,
  storeProps,
  assets,
  chunksManifest,
  isDev
}) {

  return async (req, res) => {

    // Router context is passed to routes as props.staticContext
    // After render, its value is used by router and server-side chunk loading below
    const routerContext = {
      splitPoints: []
    }
    const helmetContext = {}

    // Run App server-side actions, then pass state

    const store = createStore(storeProps)

    let initProps = {}

    if (App.serverAction) {
      try {
        initProps = await App.serverAction({
          req, res, store
        })
      } catch(e) {
        console.error('App.serverAction error', e)
      }
    }

    const markup = renderToString(
      <StaticRouter
        context={routerContext}
        location={req.url}
      >
        <HelmetProvider context={helmetContext}>
          <App store={store} {...initProps} />
        </HelmetProvider>
      </StaticRouter>
    )

    if (routerContext.url) {
      res.redirect(routerContext.url)
      return
    }

    const initState = store.getState()

    /**
     * Extract <Helmet> styles, scripts, meta
     * @see https://github.com/staylor/react-helmet-async
     * @see https://github.com/nfl/react-helmet/blob/bbfa89d13bb6ab46c1900b2be1c3f808bbf63432/src/Helmet.js#L16
     */
    const { helmet } = helmetContext

    let head = ['title', 'meta', 'link', 'style'].map(type =>
      helmet ? helmet[type].toString() : ''
    ).join('')

    const foot = helmet ? helmet.script.toString() : ''

    const htmlAttributes = helmet ? helmet.htmlAttributes.toString() : ''
    const bodyAttributes = helmet ? helmet.bodyAttributes.toString() : ''

    const styles = [
      ...(assets.client.css ? [ assets.client.css ] : [])
    ]

    const scripts = [
      ...(assets.client.js ? [ assets.client.js ] : [])
    ]

    // Client runs on different port during development
    const scriptAttr = isDev ? ' crossorigin' : ''

    /**
     * Improve page render performance by preloading chunks needed by the page.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
     */

    const  {
      splitPoints = []
    } = routerContext

    for (const name of splitPoints) {
      if (!chunksManifest[name]) {
        console.warn(`Split point not found in chunks manifest: "${name}"`)
        continue
      }

      // Chunks include source maps, so filter them out below
      const {
        css = [],
        js = []
      } = chunksManifest[name]

      head +=
        css.filter(file => file.substr(-4)==='.css').map(
          src => `<link rel="preload" href="${src}" as="style">`
        ).join('\n')

        + js.filter(file => file.substr(-3)==='.js').map(
          src => `<link rel="preload" href="${src}" as="script"${scriptAttr}>`
        ).join('\n')
    }

    res.status(200).send(
      `<!doctype html>
<html ${ htmlAttributes }>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  ${ head }
  ${ styles.map(src =>
    `<link rel="stylesheet" href="${src}">`
  ).join('\n') }
  <script>
  window.__INIT_STATE__ = ${ JSON.stringify(initState) }
  window.__INIT_CHUNKS__ = ${ JSON.stringify(splitPoints) }
  </script>
  ${ scripts.map(src =>
    `<script src="${src}" defer${scriptAttr}></script>`
  ).join('\n') }
</head>
<body ${ bodyAttributes }>
  <div id="root">${markup}</div>
  ${ foot }
</body>
</html>`
    )
  }
}