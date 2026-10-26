import { Stillflow, State } from "./src/core/__init__.js"
import { List, Collection } from "./src/bindings/__init__.js"
import { DOM } from "./src/ports/dom.js"

class ClonableTextBinding {
  constructor(element) {
    this._element = element
  }

  mount() {
    return this._element
  }

  update(view) {
    this._element.childNodes[0].nodeValue = `[${view.x}, ${view.y}]`
  }

  unmount() {
    this._element.remove()
  }

  clone() {
    return new ClonableTextBinding(this._element.cloneNode(true))
  }
}

class TextBinding {
  constructor() {
    this._element = document.createElement('div')
    this._text = document.createTextNode(String())
    this._element.appendChild(this._text)
  }

  mount() {
    return this._element
  }

  update(view) {
    this._text.nodeValue = `[${view.x}, ${view.y}]`
  }

  unmount() {
    this._element.remove()
  }

  clone() {
    return new ClonableTextBinding(this._element.cloneNode(true))
  }
}

const stillflow = Stillflow(State())

const vx = stillflow.make('x')
const vy = stillflow.make('y')
const vnodes = stillflow.make('nodes')

const schema = stillflow.compiles({
  x: vx.once(),
  y: vy.once()
})

const root = new DOM(stillflow, document.body)

const nodes = new List({
  port: root,
  items: vnodes
})

const collection = new Collection({
  port: root,
  items: nodes,
  each: () => new TextBinding()
})

for (let index = 0; index < 50000; index++) {
  stillflow.write_uncommited([vx, index], [vy, index * 2])

  nodes.add(stillflow.builds(schema))
}

collection.mount()

nodes.flush()

