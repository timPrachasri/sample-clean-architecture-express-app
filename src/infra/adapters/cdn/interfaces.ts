interface ICDNWritable {
  write<T, R>(content: T, fileName: string, options?: R): Promise<string>
}

export type ICDNAdapter = ICDNWritable
