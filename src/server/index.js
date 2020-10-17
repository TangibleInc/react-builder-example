import path from 'path'
import React from 'react'
import express from 'express'
import createRenderer from './render'
import App from '../App'
import * as storeProps from '../state'
import routes from '../routes'
import api from './api'

const config = {
  App,
  storeProps,

  isDev: process.env.NODE_ENV==='development',

  // Environment variables defined by builder
  publicDir: path.resolve(
    path.join(__dirname, process.env.APP_PUBLIC_DIR)
  ),
  assets: require(process.env.APP_ASSETS_MANIFEST),
  chunksManifest: require(process.env.APP_CHUNKS_MANIFEST),
}

// Shortcut for import React from 'react'
global.React = React

const app = express()
const renderer = createRenderer(config)

app
  .disable('x-powered-by')
  .use(express.static(config.publicDir))

api(app)

app.get('/*', renderer)

if (process.env.APP_EXPORT) {
  require('@tangible/react-builder/export')({
    dest: config.publicDir,
    routes
  })
}

export default app
