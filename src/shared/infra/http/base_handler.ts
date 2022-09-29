import * as express from 'express'
import jsonexport from 'jsonexport'

import {
  BaseError,
  Either,
  InternalServerError,
  Result,
  defaultLogger,
  left,
  stdErrorLogger,
} from '~/shared/core'

type IHttpResponse =
  | {
      status: string
      data: Record<string, any>
    }
  | string

/* The BaseHandler class is an abstract class that defines the executeImpl method. The executeImpl
method is the implementation of the execute method. The execute method is the entry point of the
handler.

The execute method is responsible for parsing the request and calling the executeImpl method.

The executeImpl method is responsible for handling the request and returning the response.
*/
export abstract class BaseHandler {
  protected abstract executeImpl(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any>

  public async execute(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    try {
      await this.executeImpl(req, res)
    } catch (err) {
      BaseHandler.parseResponse<null>(
        res,
        left(
          Result.fail<InternalServerError>(
            new InternalServerError('Internal Server Error', err),
          ),
        ),
      )
    }
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    message: IHttpResponse,
  ): any {
    return res.status(code).json(message)
  }

  /**
   * If the usecaseEither is a Right, then return a 200 OK with the data. If the usecaseEither is a
   * Left, then return a 400 Bad Request with the error message
   * @param res - express.Response
   * @param usecaseEither - Either<Result<BaseError>, Result<R>>
   * @returns Nothing.
   */
  public static parseResponse<R>(
    res: express.Response,
    usecaseEither: Either<Result<BaseError>, Result<R>>,
  ): any {
    if (usecaseEither.isRight()) {
      const value = usecaseEither.value.getValue()
      defaultLogger.info('', { meta: value })

      return BaseHandler.jsonResponse(res, 200, {
        status: 'success',
        data: usecaseEither.value.getValue(),
      })
    }
    const err = usecaseEither.value.errorValue()

    defaultLogger.warn(`${err.message}-${err.reason}`)
    stdErrorLogger.error(err.maybeError)

    return BaseHandler.jsonResponse(res, err.code, {
      status: 'error',
      data: {
        message: err.message,
      },
    })
  }

  public static downloadResponse<R>(
    res: express.Response,
    usecaseEither: Either<Result<BaseError>, Result<R>>,
  ): any {
    if (usecaseEither.isRight()) {
      const value = usecaseEither.value.getValue()
      defaultLogger.info('', { meta: value })

      jsonexport(usecaseEither.value.getValue(), function (err, csv) {
        if (err) {
          throw err
        }
        res.header('Content-Type', 'text/csv')
        res.attachment('items.csv')
        res.write(csv, 'binary')
        res.end()
      })
      return
    }
    const err = usecaseEither.value.errorValue()

    defaultLogger.warn(`${err.message}-${err.reason}`)
    stdErrorLogger.error(err.maybeError)

    return BaseHandler.jsonResponse(res, err.code, {
      status: 'error',
      data: {
        message: err.message,
      },
    })
  }
}
