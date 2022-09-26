import express from 'express'

import { Result, right } from '~/shared/core'

import { BaseHandler } from '../..'

const v1Router = express.Router()

v1Router.get('/healthz', (req, res) => {
  return BaseHandler.parseResponse(res, right(Result.ok()))
})

export { v1Router }
