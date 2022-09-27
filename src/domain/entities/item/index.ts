import {
  Option,
  fromNullable,
  getOrElse,
  match,
  none,
  some,
} from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { DateTime } from 'luxon'

import { Unit } from '~/domain/value-objects'
import { Entity } from '~/shared/domain'
import { UniqueEntityID } from '~/shared/domain'

import { IItemProps, IItemUpdateParams } from './interfaces'

export class ItemEntity extends Entity<IItemProps> {
  constructor(props: IItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get unit(): Unit {
    return this.props.unit
  }

  get updatedAt(): Date {
    return pipe(
      fromNullable(this.props.updatedAt),
      getOrElse(() => DateTime.utc().toJSDate()),
    )
  }

  get createdAt(): Date {
    return pipe(
      fromNullable(this.props.createdAt),
      getOrElse(() => DateTime.utc().toJSDate()),
    )
  }

  get deletedAt(): Option<Date> {
    return fromNullable(this.props.deletedAt)
  }

  get quantity(): number {
    return this.props.quantity
  }

  get location(): Option<string> {
    return fromNullable(this.props.location)
  }

  get picture(): Option<string> {
    return pipe(
      fromNullable(this.props.picture),
      match(
        () => none,
        () => {
          if (new RegExp('p_').test(this.props.picture)) {
            return some(this.props.picture)
          }
          const type = (this.props.picture as string)
            .split(';')[0]
            .split('/')[1]
          return some(`p_${DateTime.utc().toUnixInteger()}.${type}`)
        },
      ),
    )
  }

  get note(): Option<string> {
    return fromNullable(this.props.note)
  }

  public delete(): ItemEntity {
    this.props.deletedAt = DateTime.utc().toJSDate()
    return this
  }

  public update(params: IItemUpdateParams): ItemEntity {
    this.props.updatedAt = DateTime.utc().toJSDate()
    if (params.name) {
      this.props.name = params.name
    }
    if (params.quantity) {
      this.props.quantity = params.quantity
    }
    if (params.location) {
      this.props.location = params.location
    }
    if (params.picture) {
      this.props.picture = params.picture
    }
    if (params.note) {
      this.props.note = params.note
    }
    return this
  }

  public static create(props: IItemProps, id?: UniqueEntityID): ItemEntity {
    return new ItemEntity(props, id)
  }
}

export class ItemEntities extends Entity<Array<ItemEntity>> {
  constructor(props: Array<ItemEntity>) {
    super(props)
  }

  get items(): Array<ItemEntity> {
    return this.props
  }

  public static create(props: Array<ItemEntity>): ItemEntities {
    return new ItemEntities(props)
  }
}
