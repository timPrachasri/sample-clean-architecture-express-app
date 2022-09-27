import * as express from 'express'

import { IUpdateItemInputDTO, IUpdateItemResponseDTO } from '~/domain/dtos/item'
import { UseCase } from '~/shared/core/usecase'
import { BaseHandler } from '~/shared/infra/http'
import { TResponse } from '~/usecases/interface'

export class UpdateOneItemHandler extends BaseHandler {
  private _useCase: UseCase<
    IUpdateItemInputDTO,
    Promise<TResponse<IUpdateItemResponseDTO>>
  >

  constructor(
    useCase: UseCase<
      IUpdateItemInputDTO,
      Promise<TResponse<IUpdateItemResponseDTO>>
    >,
  ) {
    super()
    this._useCase = useCase
  }

  /**
   * It calls the execute method of the use case and returns the result.
   * @param req - express.Request
   * @param res - express.Response - The response object that the controller will use to send data back
   * to the client.
   * @returns The result of the use case execution.
   */
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const result = await this._useCase.execute({
      ...req.body,
      id: req.params.id,
    } as IUpdateItemInputDTO)
    return BaseHandler.parseResponse<IUpdateItemResponseDTO>(res, result)
  }
}
