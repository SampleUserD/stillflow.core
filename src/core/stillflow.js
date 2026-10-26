import { Path } from './path.js'
import { Bus, Buffer, Kernel } from './kernel/__init__.js'
import { compile } from './compiler.js'
import { Registry } from './registry.js'
import { build, update } from './builder.js'

export function Stillflow(state) {
  const bus = Bus()
  const buffer = Buffer()
  const kernel = Kernel({ state, bus, buffer })

  const updates = () => {
    for (const [view, schema] of Registry.views.entries()) {
      update(schema, view, kernel)
    }
  }

  kernel.on_commit(updates)

  const on = (event, site) => bus.subscribe(event, site)

  const send = (event, payload) => bus.dispatch(event, payload)

  const local = value => ({ local: true, value })

  const compiles = schema => compile(schema)

  const builds = schema => build(schema, kernel)

  const link = schema => ({ link: true, value: schema })

  const commit = () => kernel.commit()

  const write = (commit, ...changes) => {
    for (const change of changes) {
      change[0].write(change[1])
    }

    commit()
  }

  const write_commited = (...changes) => write(commit, ...changes)

  const write_uncommited = (...changes) => write(() => { }, ...changes)

  const make = path => Path(kernel, path)

  return {
    on,
    send,
    kernel,
    compiles,
    make,
    link,
    local,
    commit,
    builds,
    write_commited,
    write_uncommited
  }
}