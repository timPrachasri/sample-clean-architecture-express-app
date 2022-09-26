import { Unit } from '~/domain/value-objects'

export interface IItemProps {
  name: string
  unit: Unit
  quantity: number

  // Optional Params
  location?: string
  picture?: string
  note?: string
  updatedAt?: Date
  createdAt?: Date
  deletedAt?: Date
}

export interface IItemUpdateParams {
  // Optional Params
  name?: string
  quantity?: number
  location?: string
  picture?: string
  note?: string
}
