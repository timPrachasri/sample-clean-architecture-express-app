import { isNone } from 'fp-ts/lib/Option'

import { IDeleteItemResponseDTO } from '~/domain/dtos'
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

export class DeleteOneItemUsecase
  implements UseCase<string, Promise<TResponse<IDeleteItemResponseDTO>>>
{
  protected _itemRepository: IItemRepository

  constructor(itemRepository: IItemRepository) {
    this._itemRepository = itemRepository
  }

  public async execute(id: string): Promise<TResponse<IDeleteItemResponseDTO>> {
    try {
      const maybeEntity = await this._itemRepository.findByID(id)
      if (isNone(maybeEntity)) {
        return left(
          Result.fail<InternalServerError>(
            new InternalServerError('Internal Server Error'),
          ),
        )
      }

      const entity = maybeEntity.value
      entity.delete()

      await this._itemRepository.save(entity)

      return right(
        Result.ok<IDeleteItemResponseDTO>({
          id: entity.id.toString(),
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
