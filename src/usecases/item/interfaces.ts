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
