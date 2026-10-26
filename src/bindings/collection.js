export class Collection {
  constructor({ port, items, each }) {
    this._port = port
    this._items = items
    this._each = each

    this._template = each({})
    this._bindings = new Map()
  }

  mount() {
    this._port.core.on(this._items.source, payload => this.commit(payload))

    return this._port.mount()
  }

  force_add(delta) {
    for (const item of delta) {
      const binding = this._template.clone()

      this._bindings.set(item, binding)

      binding.update(item)

      this._port.defer(binding.mount())
    }

    this._port.flush()
  }

  force_remove(delta) {
    for (const item of delta) {
      const binding = this._bindings.get(item)

      binding.unmount()

      this._bindings.delete(item)
    }
  }

  force_swap(delta) {
    for (const [x, y] of delta.entries()) {
      const a = this._bindings.get(x)
      const b = this._bindings.get(y)

      a.update(y)
      b.update(x)
    }
  }

  force_update(delta) {
    for (const [from, to] of delta) {
      this._bindings.get(from).update(to)
    }
  }

  commit({ type, delta }) {
    switch (type) {
      case 'add':
        this.force_add(delta)
        break
      case 'remove':
        this.force_remove(delta)
        break
      case 'swap':
        this.force_swap(delta)
        break
      case 'update':
        this.force_update(delta)
        break
    }
  }

  update() { }

  unmount() {
    this._port.unmount()
  }
}