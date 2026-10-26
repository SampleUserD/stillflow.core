export function IO(kernel, path) {
  const read = () => kernel.read(path)

  const peek = () => kernel.peek(path)

  const write = value => kernel.emit(path, value)

  const remove = () => kernel.remove(path)

  const make = name => IO(kernel, `${path}.${name}`)

  return {
    path,
    read,
    peek,
    write,
    remove,
    make
  }
}

export function Path(kernel, path) {
  const { read, peek, write, remove } = IO(kernel, path)

  const once = () => ({ snapshot: true, path })

  const ref = () => ({ live: true, path })

  const make = name => Path(kernel, sources, `${path}.${name}`)

  return {
    ref,
    once,
    read,
    peek,
    write,
    remove,
    make,
  }
}