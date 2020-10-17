# React Builder Example

Example of building a React fullstack application or static site

## Requirement

[Node.js](https://nodejs.org/en/) must be installed, with its package manager, `npm`.

## Create

To create a new project based on this example, clone this repository and give it a new name.

```sh
git clone --depth 1 https://github.com/TangibleInc/react-builder-example app-name
```

Go into the created project, and remove the `.git` folder.

```sh
cd app-name
rm -rf .git
```

Run `git init` to start a new repository as needed.


## Install

```sh
npm install
```


## Develop

Build during development - watch files and rebuild

```sh
npm run dev
```

After running this command, it will wait and rebuild scripts and styles as you edit the files.

When you're done, press CTRL+C to exit the process.


## Static site

### Export

Export as static site

```sh
npm run export
```

The folder `build/public` will contain the complete site.

### Deploy

Create a file called `deploy` at the root of the application.

```sh
touch deploy && chmod +x deploy
```

The deploy script should sync the static site to a remote server.

Example:

```sh
#!/bin/bash

rsync -vrlptz --delete ./build/public/ user@server:apps/static-site
```

Note the trailing `/` which is required for the source.

Run the following to deploy after export.

```sh
./deploy
```

## Fullstack

For a fullstack application, [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) is the recommended process manager.

This project includes `pm2.config.js`, and NPM scripts in `package.json` to start/stop the application process. The default `build` command copies files needed for production to the build folder.

### Environment

Copy the file `.env.development` to `.env.production`.

```sh
cp .env.development .env.production
```

The `development` env file is used for local development. Define all environment variables required by the application server.

The `production` env file must define the same set of environment variables for the production server. It is excluded from Git.

### Build

Build for production

```sh
npm run build
```

### Try

This following command runs the built server in production mode, as a test run.

```sh
npm run try
```

### Deploy

Follow the same step as a static site, and create a `deploy` script.

Change the rsync source to the whole `build` folder, to sync client and server.

```sh
rsync -vrlptz --delete ./build/ user@server:apps/static-site
```

Then add a line to restart the application after deploy.

```sh
ssh user@server "cd ~/apps/static-site && npm run restart"
```

Run the following to deploy after build.

```sh
./deploy
```
