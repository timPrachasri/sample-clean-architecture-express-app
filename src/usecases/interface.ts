import { BaseError, Either, Result } from '~/shared/core'

export type TResponse<T = string> = Either<Result<BaseError>, Result<T>>
