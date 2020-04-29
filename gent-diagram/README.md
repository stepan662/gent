### Gent - Library for easy business processes implementation

# Gent diagram

This React compoenent will allow you to visualize schema and state of your process.

Install:

```
npm install gent-diagram

# or

yarn add gent-diagram
```

Use it in your react project with passed standard gent process schema and state

```ts
import GentDiagram from 'gent-diagram'

const Diagram = ({ schema, process }) => {
  return <GentDiagram schema={schema} state={process} />
}
```

Component will also work without state property - displaying just schema of the process.

Check [gent-example](https://github.com/stepan662/gent-example).
