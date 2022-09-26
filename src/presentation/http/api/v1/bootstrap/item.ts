import { Config, JsonDB } from 'node-json-db'
import { join } from 'path'

import { dbFilePath, staticFilePath } from '~/constants'
import { StaticCDNAdapter } from '~/infra/adapters/cdn'
import { ItemRepository } from '~/infra/repos/file/item'
import { CreateOneItemUsecase } from '~/usecases/item'

import { CreateOneItemHandler } from '../item'

// CDN adapter
const imageStaticFilePath = join(staticFilePath, 'images')
const imageStaticCDNAdapter = new StaticCDNAdapter(imageStaticFilePath)

// Use JSON file for storage
const db = new JsonDB(new Config(dbFilePath, false, false, '/'))

export const eventRepository = new ItemRepository(db)

// Usecases
export const createOneItemUsecase = new CreateOneItemUsecase(
  imageStaticCDNAdapter,
  eventRepository,
)

// Presentations
export const createOneItemHandler = new CreateOneItemHandler(
  createOneItemUsecase,
)
