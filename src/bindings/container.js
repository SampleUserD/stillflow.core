export class Container {
  constructor({ children, port }) {
    this._children = children
    this._port = port
  }

  mount() {
    for (const child of this._children) {
      this._port.defer(child)
    }

    return this._port.flush()
  }

  update(view) {
    for (const child of this._children) {
      child.update(view)
    }
  }

  unmount() {
    for (const child of this._children) {
      this._port.unmount(child)
    }
  }

  clone() {
    const children = this._children.map(child => child.clone())
    const port = this._port

    return new Container({ children, port })
  }
}