export function compile(source) {
  const schema = {
    snapshot: {},
    local: {},
    links: {},
    live: {}
  }

  for (const key of Object.keys(source)) {
    const operator = source[key]

    if (operator.snapshot) {
      schema.snapshot[key] = operator.path
    } else if (operator.live) {
      schema.live[key] = operator.path
    } else if (operator.local) {
      schema.local[key] = operator.value
    } else if (operator.link) {
      schema.links[key] = compile(operator.value)
    }
  }

  return schema
}
