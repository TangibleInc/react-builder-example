const path = require('path')
const fs = require('fs-extra')
const globby = require('globby')
const chokidar = require('chokidar')
const chalk = require('chalk')

/**
 * Automatic generation of route chunks from index files in src/pages
 *
 * Produces the following files in src/routes:
 *
 * - chunks.client.js
 * - chunks.server.js
 *
 * They are imported from elsewhere as 'chunks', and the builder aliases the corresponding
 * variant for client and server bundles.
 */
module.exports = async function() {

  const cwd = process.cwd()
  const pagesDir = path.join(cwd, 'src', 'pages')
  const routesDir = path.join(cwd, 'src', 'routes')

  const indexGlob = path.join(pagesDir, '**/{index,404}.{js,tsx,mdx}')

  const generate = async () => {

    const allIndexes = await globby(
      indexGlob
    )

    const exportedMap = allIndexes.reduce((map, file) => {

      const fileBase = file.split('/').pop()
      const extension = fileBase.split('.').pop()

      const relativeFile = path.relative(routesDir, file)

      let route = path.relative(pagesDir, path.dirname(file))
        || 'index'

      if (fileBase.split('.')[0]==='404') route = '404'

      // mdx can be overridden by js, tsx
      if (map[ route ] && extension==='mdx') return map

      map[ route ] = {
        file: relativeFile,
        extension
      }

      return map
    }, {})

    const createChunksString = type => map => Object.keys(map).map(route =>
      type==='client'

        // Client - Dynamic import
        ? `'${route}': load(() => import(/* webpackChunkName: "${route}" */ '${
          exportedMap[route].file
        }'))`

        // Server - Require (and bundle all)
        : `'${route}': load('${route}', require('${
          exportedMap[route].file
        }'))`

    ).join(',\n  ')

    // console.log(chunks)

    const chunksClient = path.join(routesDir, 'chunks.client.js')
    const createClientChunks = createChunksString('client')

    await fs.writeFile(chunksClient, `// Generated - Client-side routes

import load from './loadAsync'

export default {
  ${createClientChunks(exportedMap)}
}
`, 'utf8')


    const chunksServer = path.join(routesDir, 'chunks.server.js')
    const createServerChunks = createChunksString('server')

    await fs.writeFile(chunksServer, `// Generated - Server-side routes

import load from './load'

export default {
  ${createServerChunks(exportedMap)}
}
`, 'utf8')

    console.log(chalk.green('Dynamic'), 'Routes generated in', path.relative(cwd, routesDir))
  }

  await generate()

  if (process.env.NODE_ENV!=='development') return

  // Dev mode - Watch files and regenerate routes

  // https://github.com/paulmillr/chokidar#api
  const watchOptions = {
    ignoreInitial: true,
    followSymlinks: true,

    // Needed to detect when containing parent folder is removed
    usePolling: true,
    interval: 1000
  }

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

  chokidar.watch(

    // `${pagesDir}/**/*` // Watch folders also

    indexGlob,
    watchOptions
  )
    .on('all', (event, file) => {
      // Only watch for add/remove
      if (['add', 'unlink', 'change'].indexOf(event) < 0) return
      console.log(chalk.blue(capitalize(event)), path.relative(cwd, file))
      generate()
    })
}
