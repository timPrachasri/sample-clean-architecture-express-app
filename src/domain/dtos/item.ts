export interface ICreateItemInputDTO {
  name: string
  unit: {
    name: string
    kernelCount: number
  }
  quantity: number

  // Optional Params
  location?: string
  picture?: string
  note?: string
}

export interface ICreateItemResponseDTO {
  id: string
  name: string
  unit: {
    name: string
    kernelCount: number
  }
  quantity: number
  location: string | null
  picture: string | null
  note: string | null
  updatedAt: string | null
  createdAt: string | null
}

export interface IUpdateItemInputDTO {
  id: string
  name?: string
  quantity?: number
  location?: string
  picture?: string
  note?: string
}

export interface IUpdateItemResponseDTO {
  id: string
  name: string
  unit: {
    name: string
    kernelCount: number
  }
  quantity: number
  location: string | null
  picture: string | null
  note: string | null
  updatedAt: string | null
  createdAt: string | null
}

export interface IGetItemResponseDTO {
  id: string
  name: string
  unit: {
    name: string
    kernelCount: number
  }
  quantity: number
  location: string | null
  picture: string | null
  note: string | null
  updatedAt: string | null
  createdAt: string | null
}

export type IGetItemsResponseDTO = Array<IGetItemResponseDTO>
