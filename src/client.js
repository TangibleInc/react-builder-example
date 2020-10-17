import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { createStore } from 'medux'

import App from './App'
import * as storeProps from './state'
import chunks from './routes/chunks.client'
import './styles/index.scss'

// Shortcut for import React from 'react'
global.React = React

;(async () => {

  /**
   * Await async components during development, so initial render is
   * exactly the same as from server. Skip this during production to
   * minimize time to initial render.
   */

  if (process.env.NODE_ENV==='development') {
    const promises = []
    for (const name of window.__INIT_CHUNKS__ || []) {
      if (chunks[name]) promises.push(
        chunks[name].loadComponent()
      )
    }
    // Run in parallel
    await Promise.all(promises)
  }

  const store = createStore({
    ...storeProps,
    state: window.__INIT_STATE__
  })

  hydrate(
    <BrowserRouter>
      <HelmetProvider>
        <App store={store} />
      </HelmetProvider>
    </BrowserRouter>,
    document.getElementById('root')
  )
})()

if (module.hot) {
  module.hot.accept()
}
