import express from 'express'

import { createOneItemHandler } from '~/presentation/http/api/v1'
import { Result, right } from '~/shared/core'

import { BaseHandler } from '../..'

const v1Router = express.Router()

v1Router.get('/healthz', (req, res) => {
  return BaseHandler.parseResponse(res, right(Result.ok()))
})

v1Router.post('/item', (req, res) => {
  createOneItemHandler.execute(req, res)
})

export { v1Router }
