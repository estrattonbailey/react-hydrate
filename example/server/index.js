import 'source-map-support/register'

/**
 * Pull in env vars
 */
require('dotenv').config()

/**
 * ENV vars
 */
const {
  NODE_ENV,
  PORT
} = process.env

const PRODUCTION = NODE_ENV === 'production'

const express = require('express')
const compression = require('compression')
const cors = require('cors')
// const parser = require('body-parser')
const path = require('path')

const router = require('./router.js')

/**
 * Express instance
 */
const app = express()
const port = PORT || 8888

const staticPath = PRODUCTION ? path.join(__dirname, '../public') : path.join(__dirname, '../dist/public')

app.use('*', cors())
app.use(compression())
app.use('/public', express.static(staticPath, { maxage: PRODUCTION ? 86400000 : 0 }))

app.use(router)

app.listen(port, e => {
  console.log(`Frame server running on port ${port}`)
})
