import { ValueObject } from '../../shared/domain'

export interface UnitProps {
  name: string
  kernelCount: number
}

export class Unit extends ValueObject<UnitProps> {
  get name(): string {
    return this.props.name
  }

  get kernelCount(): number {
    return this.props.kernelCount
  }
}
