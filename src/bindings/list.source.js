export class ListSource {
  static ADD = 'add'
  static SWAP = 'swap'
  static UPDATE = 'update'
  static REMOVE = 'remove'

  constructor({ port, items }) {
    this._port = port
    this._items = items
  }

  send(type, delta) {
    this._port.core.send(this._items, { type, delta })
  }
}