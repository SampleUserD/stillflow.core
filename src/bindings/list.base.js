import { ListSource } from "./list.source.js"

export class List {
  constructor({ port, items }) {
    this._port = port
    this._items = items
    this._source = new ListSource({ port, items })

    this._add = new Set()
    this._swap = new Map()
    this._update = new Map()
    this._remove = new Set()
  }

  add(view) {
    if (this._remove.has(view)) {
      this._remove.delete(view)
    }

    this._add.add(view)
  }

  remove(view) {
    this._update.remove(view)

    if (this._add.has(view)) {
      this._add.delete(view)
    }

    this._remove.add(view)
  }

  update(view, patch) {
    if (this._add.has(view) || this._remove.has(view)) {
      return
    }

    this._update.set(view, patch)
  }

  swap(a, b) {
    if (this._remove.has(a) || this._remove.has(b)) {
      return
    }

    this._swap.set(a, b)
  }

  build() {
    const items = this._items.peek() || []

    for (const item of this._add) {
      items.push(item)
    }

    for (const [from, to] of this._update) {
      items[from] = to
    }

    for (const [from, to] of this._swap) {
      const temporary = items[to]
      items[to] = items[from]
      items[from] = temporary
    }

    this._items.write(items)
  }

  flush() {
    this.build()

    this._source.send(ListSource.ADD, this._add)
    this._source.send(ListSource.SWAP, this._swap)
    this._source.send(ListSource.REMOVE, this._remove)
    this._source.send(ListSource.UPDATE, this._update)

    this._add.clear()
    this._swap.clear()
    this._remove.clear()
    this._update.clear()
  }

  get source() {
    return this._items
  }
}