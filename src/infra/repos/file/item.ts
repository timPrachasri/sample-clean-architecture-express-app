import { filter, findFirst, map } from 'fp-ts/Array'
import { fromNullable, getOrElse, getOrElseW, match } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { JsonDB } from 'node-json-db'

import { ItemEntities, ItemEntity } from '~/domain/entities/item'
import { Unit } from '~/domain/value-objects'

import { IItemRepository } from '../interfaces'
import { IJSONDBSchema, IJSONDBSchemaIItem, findItemQuery } from './interfaces'

export class ItemRepository implements IItemRepository {
  protected db: JsonDB
  protected dataPath: string

  constructor(low: JsonDB) {
    this.db = low
    this.dataPath = '/items'
  }

  async createOne(entity: ItemEntity): Promise<boolean> {
    // From a particular DataPath
    const data = (await this.db.getObject<IJSONDBSchema>(
      this.dataPath,
    )) as IJSONDBSchema
    const item: IJSONDBSchemaIItem = {
      id: entity.id.toString(),
      name: entity.name,
      unit: {
        name: entity.unit.name,
        kernelCount: entity.unit.kernelCount,
      },
      quantity: entity.quantity,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      location: getOrElseW<string | null>(() => null)(entity.location),
      picture: getOrElseW<string | null>(() => null)(entity.picture),
      note: getOrElseW<string | null>(() => null)(entity.note),
    }

    await this.db.push(this.dataPath, [...data, item])

    await this.db.save()

    return true
  }

  async save(entity: ItemEntity): Promise<boolean> {
    const data = (await this.db.getObject<IJSONDBSchema>(
      this.dataPath,
    )) as IJSONDBSchema

    const writeResult = pipe(
      fromNullable(data),
      getOrElse(() => [] as IJSONDBSchema),
      findFirst((item) => {
        return item.id === entity.id.toString()
      }),
      match(
        () => true,
        (foundItem) => {
          foundItem.name = entity.name
          foundItem.quantity = entity.quantity
          foundItem.location = getOrElseW<string | null>(() => null)(
            entity.location,
          )
          foundItem.picture = getOrElseW<string | null>(() => null)(
            entity.picture,
          )
          foundItem.note = getOrElseW<string | null>(() => null)(entity.note)
          foundItem.updatedAt = entity.updatedAt
          foundItem.deletedAt = getOrElseW<Date | null>(() => null)(
            entity.deletedAt,
          )
          return true
        },
      ),
    )

    await this.db.push(this.dataPath, data)

    await this.db.save()

    return writeResult
  }

  async find(condition?: findItemQuery): Promise<ItemEntities> {
    const data = (await this.db.getObject<IJSONDBSchema>(
      this.dataPath,
    )) as IJSONDBSchema

    const items: Array<ItemEntity> = pipe(
      fromNullable(data),
      getOrElse(() => [] as Array<IJSONDBSchemaIItem>),
      filter((item: IJSONDBSchemaIItem) => {
        if (condition?.id) {
          return item.id === condition.id
        }

        if (!condition?.includeDeleted) {
          return item.deletedAt == undefined
        }

        return true
      }),
      map((item: IJSONDBSchemaIItem) => {
        return ItemEntity.create({
          name: item.name,
          unit: new Unit({
            name: item.unit.name,
            kernelCount: item.unit.kernelCount,
          }),
          quantity: item.quantity,
          updatedAt: item.updatedAt ?? undefined,
          createdAt: item.createdAt ?? undefined,
          location: item.location ?? undefined,
          picture: item.picture ?? undefined,
          note: item.note ?? undefined,
        })
      }),
    )

    return ItemEntities.create(items)
  }
}
