import { Maybe, MaybeAsync } from 'purify-ts'

export const maybePromise = <T>(value: Promise<T | undefined | null>) =>
  MaybeAsync.fromPromise(() => value.then(Maybe.fromNullable))
