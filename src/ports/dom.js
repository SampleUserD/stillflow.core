class Core {
  constructor(application) {
    this._application = application
  }

  on(event, site) {
    return this._application.on(event, site)
  }

  send(event, payload) {
    this._application.send(event, payload)
  }
}

class User {
  constructor(application) {

  }
}

export class DOM {
  constructor(application, root) {
    this._root = root
    this._fragment = document.createDocumentFragment()

    this._core = new Core(application)
    this._user = new User(application)
  }

  mount() {
    return this._root
  }

  defer(node) {
    this._fragment.appendChild(node)
  }

  flush() {
    this._root.appendChild(this._fragment)

    this._fragment = document.createDocumentFragment()
  }

  unmount() {
    this._root.remove()
  }

  get core() {
    return this._core
  }

  get user() {
    return this._user
  }
}