import * as express from 'express'

import { ICreateItemInputDTO, ICreateItemResponseDTO } from '~/domain/dtos/item'
import { UseCase } from '~/shared/core/usecase'
import { BaseHandler } from '~/shared/infra/http'
import { TResponse } from '~/usecases/interface'

export class CreateOneItemHandler extends BaseHandler {
  private _useCase: UseCase<
    ICreateItemInputDTO,
    Promise<TResponse<ICreateItemResponseDTO>>
  >

  constructor(
    useCase: UseCase<
      ICreateItemInputDTO,
      Promise<TResponse<ICreateItemResponseDTO>>
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
    const result = await this._useCase.execute(req.body as ICreateItemInputDTO)
    return BaseHandler.parseResponse<ICreateItemResponseDTO>(res, result)
  }
}
