import { getOrElseW, isNone, isSome } from 'fp-ts/lib/Option'

import { IUpdateItemInputDTO, IUpdateItemResponseDTO } from '~/domain/dtos'
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

export class UpdateOneItemUsecase
  implements
    UseCase<IUpdateItemInputDTO, Promise<TResponse<IUpdateItemResponseDTO>>>
{
  protected _cdnAdapter: ICDNAdapter
  protected _itemRepository: IItemRepository

  constructor(cdnAdapter: ICDNAdapter, itemRepository: IItemRepository) {
    this._cdnAdapter = cdnAdapter
    this._itemRepository = itemRepository
  }

  public async execute(
    request: IUpdateItemInputDTO,
  ): Promise<TResponse<IUpdateItemResponseDTO>> {
    try {
      const maybeEntity = await this._itemRepository.findByID(request.id)
      if (isNone(maybeEntity)) {
        return left(
          Result.fail<InternalServerError>(
            new InternalServerError('Internal Server Error'),
          ),
        )
      }

      const entity = maybeEntity.value
      entity.update({
        name: request.name,
        quantity: request.quantity,
        location: request.location,
        note: request.note,
        picture: request.picture,
      })

      await this._itemRepository.save(entity)

      if (request.picture && isSome(entity.picture)) {
        await this._cdnAdapter.write<string, void>(
          request.picture as string,
          entity.picture.value,
        )
      }

      return right(
        Result.ok<IUpdateItemResponseDTO>({
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
