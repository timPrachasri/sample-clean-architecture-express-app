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
