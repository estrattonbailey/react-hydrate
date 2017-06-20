require('babel-core/register')

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
const parser = require('body-parser')
const path = require('path')

const router = require('./router.js')

/**
 * Express instance
 */
const app = express()
const port = PORT || 8888

app.use('*', cors())
app.use(express.static(path.join(__dirname, '../public'), {
  maxage: PRODUCTION ? 86400000 : 0
}))

app.use(router)

app.listen(port, e => {
  console.log(`Frame server running on port ${port}`)
})
