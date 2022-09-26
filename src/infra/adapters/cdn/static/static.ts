import fs from 'fs'
import path from 'path'

import { ICDNAdapter } from '~/infra/adapters/cdn/interfaces'

export class StaticCDNAdapter implements ICDNAdapter {
  protected uploadPath: string

  constructor(uploadPath: string) {
    this.uploadPath = uploadPath
  }
  async write<T, R>(
    content: T,
    fileName: string,
    options?: R,
  ): Promise<string> {
    const base64Data = (content as string).replace(
      /^data:([A-Za-z-+/]+);base64,/,
      '',
    )
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(path.join(this.uploadPath, `${fileName}`), buffer)

    return fileName
  }
}
