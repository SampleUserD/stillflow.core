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

  at(index) {
    return this.items[index]
  }

  add(view) {
    this._add.add(view)
  }

  remove(index) {
    const view = this.at(index)

    this._update.delete(index)

    if (this._add.has(view)) {
      this._add.delete(view)
    }

    this._remove.add(index)
  }

  replace(index, reference) {
    if (this._remove.has(index)) {
      return
    }

    this._update.set(index, reference)
  }

  swap(a, b) {
    if (this._remove.has(a) || this._remove.has(b)) {
      return
    }

    this._swap.set(a, b)
  }

  build() {
    const items = this._items.peek() || []
    const removes = []
    const updates = new Map()
    const indices = Array.from(this._remove).sort((a, b) => b - a)

    for (const item of this._add) {
      items.push(item)
    }

    for (const [index, reference] of this._update) {
      updates.set(items[index], reference)
    }

    for (const [from, to] of this._swap) {
      const temporary = items[to]
      items[to] = items[from]
      items[from] = temporary
    }

    for (const index of indices) {
      removes.push(items.splice(index, 1)[0])
    }

    this._items.write(items)

    return { removes, updates }
  }

  flush() {
    const { removes, updates } = this.build()

    this._source.send(ListSource.ADD, this._add)
    this._source.send(ListSource.SWAP, this._swap)
    this._source.send(ListSource.UPDATE, updates)
    this._source.send(ListSource.REMOVE, removes)

    this._add.clear()
    this._swap.clear()
    this._remove.clear()
    this._update.clear()
  }

  get source() {
    return this._items
  }

  get items() {
    return this._items.peek() || []
  }
}