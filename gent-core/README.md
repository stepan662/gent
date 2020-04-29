### Gent - Library for easy business processes implementation

# Gent core

This is core part of gent, use it in your project to construct your process structure.

Install:

```
npm install gent-core

# or

yarn add gent-core
```

Implement simple process

```ts
import b from 'gent-core/lib/NodeBuilder'
import * as n from 'gent-core/lib/Node'
import Process from 'gent-core/lib/Process'

const [start, task] = b.connect(
  // start event
  n.start({
    name: 'Start',
  }),

  // task
  n.taskSystem({
    id: 'task',
    name: 'First task',
    exec: async () => {
      console.log('Hello my first task')
    },
  }),
)

task.connect(
  // end event
  n.end({
    name: 'End',
  }),
)

const simpleProcess = new Process(
  {
    id: 'process',
    name: 'My first process',
    init: (input) => input,
  },
  start,
)

export default simpleProcess
```

Check [gent-example](https://github.com/stepan662/gent-example) project to see how to connect processes to your API and database.
