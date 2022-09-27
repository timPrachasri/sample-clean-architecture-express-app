import { map } from 'fp-ts/lib/Array'
import { getOrElseW } from 'fp-ts/lib/Option'

import { IGetItemsResponseDTO } from '~/domain/dtos'
import { ItemEntity } from '~/domain/entities/item'
import { IItemRepository } from '~/infra/repos/interfaces'
import {
  InternalServerError,
  Result,
  UseCase,
  left,
  right,
} from '~/shared/core'

import { TResponse } from '../interface'

export class GetAllItemsUsecase
  implements UseCase<void, Promise<TResponse<IGetItemsResponseDTO>>>
{
  protected _itemRepository: IItemRepository

  constructor(itemRepository: IItemRepository) {
    this._itemRepository = itemRepository
  }

  public async execute(): Promise<TResponse<IGetItemsResponseDTO>> {
    try {
      const entities = await this._itemRepository.find()

      return right(
        Result.ok<IGetItemsResponseDTO>(
          map((entity: ItemEntity) => {
            return {
              id: entity.id.toString(),
              name: entity.name,
              unit: {
                name: entity.unit.name,
                kernelCount: entity.unit.kernelCount,
              },
              quantity: entity.quantity,
              location: getOrElseW<string | null>(() => null)(entity.location),
              picture: getOrElseW<string | null>(() => null)(entity.picture),
              note: getOrElseW<string | null>(() => null)(entity.note),
              updatedAt: entity.updatedAt.toISOString(),
              createdAt: entity.createdAt.toISOString(),
            }
          })(entities.items),
        ),
      )
    } catch (error) {
      return left(
        Result.fail<InternalServerError>(
          new InternalServerError('Internal Server Error', error as Error),
        ),
      )
    }
  }
}
