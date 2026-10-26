export function Buffer() {
  const messages = new Map()

  const emit = (path, value) => messages.set(path, value)

  const peek = path => messages.get(path)

  const clear = () => {
    messages.clear()
  }

  const multiphase = handles => {
    for (let stage = 0; stage < handles.length; stage++) {
      for (let [path, value] of messages.entries()) {
        handles[stage](path, value)
      }
    }
  }

  const flush = handles => {
    multiphase(handles)
    clear()
  }

  return {
    multiphase,
    clear,
    flush,
    clear,
    emit,
    peek
  }
}