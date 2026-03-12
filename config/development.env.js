'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"https://www.bctest.pro/api"',
  SWAP_API_HOST: '"https://www.bctest.pro/swap-api"',
  INVITE_HOST: '"http://localhost:8080/#/"'
})
