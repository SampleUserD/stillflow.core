export function State() {
  const state = new Map()

  const write = (path, value) => state.set(path, value)

  const read = path => state.get(path)

  const remove = path => state.delete(path)

  return {
    read,
    write,
    remove
  }
}