import { IORDER_BY } from '../interfaces'

export type findItemQuery = {
  id?: string
  includeDeleted?: boolean
} & IORDER_BY

export interface IJSONDBSchemaIItemUnit {
  name: string
  kernelCount: number
}

export interface IJSONDBSchemaIItem {
  id: string
  name: string
  unit: IJSONDBSchemaIItemUnit
  quantity: number

  // Optional Params
  location?: string | null
  picture?: string | null
  note?: string | null
  updatedAt?: Date | null
  createdAt?: Date | null
  deletedAt?: Date | null
}

export type IJSONDBSchema = Array<IJSONDBSchemaIItem>
