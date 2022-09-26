import { getOrElseW, isSome } from 'fp-ts/lib/Option'

import { ICreateItemInputDTO } from '~/domain/dtos/item'
import { ItemEntity } from '~/domain/entities/item'
import { Unit } from '~/domain/value-objects'
import { ICDNAdapter } from '~/infra/adapters/cdn/interfaces'
import { IItemRepository } from '~/infra/repos/interfaces'
import {
  InternalServerError,
  Result,
  UseCase,
  left,
  right,
} from '~/shared/core'

import { TResponse } from '../interface'
import { ICreateItemResponseDTO } from './interfaces'

export class CreateOneItemUsecase
  implements
    UseCase<ICreateItemInputDTO, Promise<TResponse<ICreateItemResponseDTO>>>
{
  protected _cdnAdapter: ICDNAdapter
  protected _itemRepository: IItemRepository

  constructor(cdnAdapter: ICDNAdapter, itemRepository: IItemRepository) {
    this._cdnAdapter = cdnAdapter
    this._itemRepository = itemRepository
  }

  public async execute(
    request: ICreateItemInputDTO,
  ): Promise<TResponse<ICreateItemResponseDTO>> {
    try {
      const entity = ItemEntity.create({
        name: request.name,
        unit: new Unit({
          name: request.unit.name,
          kernelCount: request.unit.kernelCount,
        }),
        quantity: request.quantity,
        location: request.location,
        picture: request.picture,
        note: request.note,
      })

      await this._itemRepository.createOne(entity)

      if (isSome(entity.picture)) {
        await this._cdnAdapter.write<string, null>(
          request.picture as string,
          entity.picture.value,
        )
      }

      return right(
        Result.ok<ICreateItemResponseDTO>({
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
        }),
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
