export class Lens {
  constructor({ binding, lens }) {
    this._binding = binding
    this._lens = lens
  }

  mount() {
    return this._binding.mount()
  }

  update(view) {
    this._binding.update(this._lens(view))
  }

  unmount() {
    this._binding.unmount()
  }

  clone() {
    return new Lens(this._binding.clone(), this._lens)
  }
}