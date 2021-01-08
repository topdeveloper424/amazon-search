# Amazon Search

  Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

## Installation for back-end (express.js)

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install
```
configurations ( config.js):
``` js
    mongoURL: 'mongodb://localhost:27017/amazon_db',  //Remote mongodb url
    batchNumber: 500 // batch insert number for importing excel rows
```
how to run:
```bash
$ npm start
```

Follow [our installing guide](http://expressjs.com/en/starter/installing.html)
for more information.

### Features

  * User Authentication
  * Search Data from Mongodb
  * Saved search
  * history of Uploading

### Database models
  * Datasource
  * History
  * SavedSearch

### Collection Name format
datasource collection is named in following format:
ex:  datasource@11_22_20-11_28_20
datasource@[start date]-[end date]
start and end date are provided from excel file


## Front-end(Vue.js)

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install
```
how to run:
```bash
$ npm run serve
```

configuration(config.js)
```js
serverURL : 'http://localhost:8080/'  // back-end url
```
