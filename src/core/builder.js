import { Registry } from "./registry.js"

function build_live(schema, view, kernel) {
  for (const key of Object.keys(schema.live)) {
    view[key] = kernel.read(schema.live[key])
  }
}

function build_snapshot(schema, view, kernel) {
  for (const key of Object.keys(schema.snapshot)) {
    view[key] = kernel.peek(schema.snapshot[key])
  }
}

function build_local(schema, view) {
  for (const key of Object.keys(schema.local)) {
    view[key] = schema.local[key]
  }
}

function build_links(schema, view, kernel) {
  for (const key of Object.keys(schema.links)) {
    view[key] = build(schema.links[key], kernel)
  }
}

export function update(schema, view, kernel) {
  build_live(schema, view, kernel)
}

export function build(schema, kernel) {
  const view = {}

  build_snapshot(schema, view, kernel)
  build_live(schema, view, kernel)
  build_links(schema, view, kernel)
  build_local(schema, view)

  Registry.views.set(view, schema)

  return view
}
