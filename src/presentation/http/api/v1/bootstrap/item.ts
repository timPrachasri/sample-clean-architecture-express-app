import { Config, JsonDB } from 'node-json-db'
import { join } from 'path'

import { dbFilePath, staticFilePath } from '~/constants'
import { StaticCDNAdapter } from '~/infra/adapters/cdn'
import { ItemRepository } from '~/infra/repos/file/item'
import {
  CreateOneItemUsecase,
  DeleteOneItemUsecase,
  GetAllItemsUsecase,
  UpdateOneItemUsecase,
} from '~/usecases/item'

import {
  CreateOneItemHandler,
  DeleteOneItemHandler,
  DownloadAllItemsHandler,
  GetAllItemsHandler,
  UpdateOneItemHandler,
} from '../item'

// CDN adapter
const imageStaticFilePath = join(staticFilePath, 'images')
const imageStaticCDNAdapter = new StaticCDNAdapter(imageStaticFilePath)

// Use JSON file for storage
const db = new JsonDB(new Config(dbFilePath, false, false, '/'))

export const itemRepository = new ItemRepository(db)

// Usecases
export const createOneItemUsecase = new CreateOneItemUsecase(
  imageStaticCDNAdapter,
  itemRepository,
)

export const getAllItemsUsecase = new GetAllItemsUsecase(itemRepository)

export const updateOneItemUsecase = new UpdateOneItemUsecase(
  imageStaticCDNAdapter,
  itemRepository,
)

export const deleteOneItemUsecase = new DeleteOneItemUsecase(itemRepository)

// Presentations
export const createOneItemHandler = new CreateOneItemHandler(
  createOneItemUsecase,
)

export const getAllItemsHandler = new GetAllItemsHandler(getAllItemsUsecase)

export const downloadAllItemsHandler = new DownloadAllItemsHandler(
  getAllItemsUsecase,
)

export const updateOneItemHandler = new UpdateOneItemHandler(
  updateOneItemUsecase,
)

export const deleteOneItemHandler = new DeleteOneItemHandler(
  deleteOneItemUsecase,
)
