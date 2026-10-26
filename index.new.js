import { Stillflow, State } from "./src/core/__init__.js"

const stillflow = Stillflow(State())

const vx = stillflow.make('x')
const vy = stillflow.make('y')

const old = {
  x: vx.once(),
  y: vy.once()
}

const schema = stillflow.compiles({
  o: stillflow.link(old),
  x: vx.once(),
  y: vy.once()
})

const nodes = []
const count = 500

console.time(`Append ${count} nodes to the table`)

for (let index = 0; index < count; index++) {
  stillflow.write_uncommited([vx, index], [vy, index * 100])

  nodes.push(stillflow.builds(schema))
}

stillflow.commit()

console.timeEnd(`Append ${count} nodes to the table`)

console.log(nodes)