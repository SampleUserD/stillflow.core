export function Bus() {
  const subscriptions = new Map()

  const read = path => subscriptions.get(path)

  const add = (path, site) => {
    const subscribers = read(path) || new Set()

    subscribers.add(site)

    subscriptions.set(path, subscribers)
  }

  const remove = (path, site) => {
    const subscribers = read(path)

    if (subscribers === undefined) {
      return
    }

    subscribers.delete(site)

    if (subscribers.size === 0) {
      subscriptions.delete(path)
    }
  }

  const subscribe = (path, site) => {
    add(path, site)

    return () => remove(path, site)
  }

  const dispatch = (path, payload) => {
    const subscribers = read(path)

    if (subscribers === undefined) {
      return
    }

    for (const subscriber of subscribers) {
      subscriber(payload)
    }
  }

  const clear = () => subscriptions.clear()

  return {
    clear,
    dispatch,
    subscribe
  }
}