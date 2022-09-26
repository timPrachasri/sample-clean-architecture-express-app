import { ItemEntities, ItemEntity } from '~/domain/entities/item'

import { findItemQuery } from './file/interfaces'

export type IORDER_BY = 'ASC' | 'DESC'

export interface ITransactionAdaptor {
  createTransaction(): Promise<ITransaction>
}

export interface ITransaction {
  commit(): Promise<void>
  rollback(): Promise<void>
}

export interface IItemRepository {
  createOne(entity: ItemEntity): Promise<boolean>
  find(condition?: findItemQuery): Promise<ItemEntities>
  save(entity: ItemEntity): Promise<boolean>
}
