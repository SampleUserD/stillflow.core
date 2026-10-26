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
    if (view.selected) {
      this._element.style.background = 'red'
    } else {
      this._element.style.background = String()
    }

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
const vselected = stillflow.make('selected')
const vnodes = stillflow.make('nodes')

const schema = stillflow.compiles({
  x: vx.once(),
  y: vy.once(),
  selected: vselected.once()
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

for (let index = 0; index < 1000; index++) {
  stillflow.write_uncommited([vx, index], [vy, index * 2], [vselected, index === 5])

  nodes.add(stillflow.builds(schema))
}

stillflow.write_uncommited([vx, 10000], [vy, 10000], [vselected, false])

nodes.swap(1, 998)
nodes.replace(4, stillflow.builds(schema))

collection.mount()

nodes.flush()