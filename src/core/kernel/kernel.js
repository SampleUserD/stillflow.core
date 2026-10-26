import events from "./events/__init__.js"

export function Kernel({ state, bus, buffer }) {
  const on = (path, site) => bus.subscribe(path, site)

  const on_commit = site => on('commit', site)

  const emit = (path, value) => buffer.emit(path, value)

  const read = path => state.read(path)

  const peek = path => buffer.peek(path)

  const actualize = (path, value) => state.write(path, value)

  const PHASES = [actualize]

  const commit = () => {
    buffer.multiphase(PHASES)
    bus.dispatch('commit')
    buffer.clear()
  }

  return {
    read,
    peek,
    emit,
    commit,
    on_commit
  }
}