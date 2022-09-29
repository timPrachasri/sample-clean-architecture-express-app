import * as express from 'express'
import jsonexport from 'jsonexport'

import { IGetItemsResponseDTO } from '~/domain/dtos'
import { UseCase } from '~/shared/core/usecase'
import { BaseHandler } from '~/shared/infra/http'
import { TResponse } from '~/usecases/interface'

export class DownloadAllItemsHandler extends BaseHandler {
  private _useCase: UseCase<void, Promise<TResponse<IGetItemsResponseDTO>>>

  constructor(
    useCase: UseCase<void, Promise<TResponse<IGetItemsResponseDTO>>>,
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
    const result = await this._useCase.execute()
    return BaseHandler.downloadResponse<IGetItemsResponseDTO>(res, result)
  }
}
