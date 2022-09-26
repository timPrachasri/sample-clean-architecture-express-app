import express from 'express'
import { body, validationResult } from 'express-validator'
import isBase64 from 'is-base64'

import {
  createOneItemHandler,
  getAllItemsHandler,
} from '~/presentation/http/api/v1'
import { BadRequest, Result, left, right } from '~/shared/core'

import { BaseHandler } from '../..'

const v1Router = express.Router()

v1Router.get('/healthz', (req, res) => {
  return BaseHandler.parseResponse(res, right(Result.ok()))
})

v1Router.post(
  '/items',
  body('name').isLength({ min: 1 }),
  body('unit.name').isLength({ min: 1 }),
  body('unit.kernelCount')
    .isNumeric()
    .custom((value) => value > 0),
  body('quantity')
    .isNumeric()
    .custom((value) => value > 0),
  body('location').optional().isLength({ min: 1, max: 20 }),
  body('note').optional().isLength({ min: 1, max: 20 }),
  body('picture')
    .optional()
    .custom((value) => {
      return isBase64(value, { mimeRequired: true })
    }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return BaseHandler.parseResponse<null>(
        res,
        left(Result.fail<BadRequest>(new BadRequest('Bad Request'))),
      )
    }
    createOneItemHandler.execute(req, res)
  },
)

v1Router.get('/items', (req, res) => {
  getAllItemsHandler.execute(req, res)
})

export { v1Router }
